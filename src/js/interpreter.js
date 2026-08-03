import { audioSystem } from './audio.js';

export class DroneInterpreter {
  constructor(onStateUpdate, onCardHighlight, onComplete) {
    this.onStateUpdate = onStateUpdate;
    this.onCardHighlight = onCardHighlight;
    this.onComplete = onComplete;

    this.resetState();
    this.isRunning = false;
    this.isPaused = false;
    this.speedMultiplier = 1.0;
    this.animFrameId = null;
  }

  resetState() {
    this.state = {
      x: 0,           // X 좌표 (미터)
      y: 0,           // Y 좌표 (미터)
      z: 0,           // 고도 (미터, 0 = 착륙)
      heading: 0,     // 바라보는 각도 (0 = 북/위, 90 = 동/우, 180 = 남/아래, 270 = 서/좌)
      ledColor: 'off',// LED 조명 색상
      isLanded: true, // 착륙 여부
      flipAngle: 0,   // 플립 덤블링 애니메이션 각도 (0~360)
      trail: [{ x: 0, y: 0, z: 0 }]
    };
    if (this.onStateUpdate) this.onStateUpdate(this.state);
  }

  // 카드 배열을 실행 큐로 플래튼(Flat Expansion)
  parseProgram(cards) {
    const queue = [];
    let i = 0;

    while (i < cards.length) {
      const card = cards[i];
      if (!card) {
        i++;
        continue;
      }

      if (card.action.type === 'LOOP_START') {
        const loopCount = card.action.count || 2;
        const startIndex = i + 1;
        let endIndex = -1;
        let depth = 1;

        // 매칭되는 LOOP_END 탐색
        for (let j = i + 1; j < cards.length; j++) {
          if (cards[j].action.type === 'LOOP_START') depth++;
          else if (cards[j].action.type === 'LOOP_END') {
            depth--;
            if (depth === 0) {
              endIndex = j;
              break;
            }
          }
        }

        if (endIndex !== -1) {
          const bodyCards = cards.slice(startIndex, endIndex);
          for (let c = 0; c < loopCount; c++) {
            bodyCards.forEach((bc, subIdx) => {
              queue.push({
                card: bc,
                originalIndex: startIndex + subIdx
              });
            });
          }
          i = endIndex + 1;
          continue;
        }
      }

      queue.push({
        card: card,
        originalIndex: i
      });
      i++;
    }

    return queue;
  }

  async run(cards, speed = 1.0) {
    if (this.isRunning) return;
    this.resetState();
    this.isRunning = true;
    this.isPaused = false;
    this.speedMultiplier = speed;

    const queue = this.parseProgram(cards);
    if (queue.length === 0) {
      this.isRunning = false;
      if (this.onComplete) this.onComplete();
      return;
    }

    for (let step = 0; step < queue.length; step++) {
      if (!this.isRunning) break;

      const item = queue[step];
      if (this.onCardHighlight) {
        this.onCardHighlight(item.originalIndex);
      }

      await this.executeCard(item.card);
    }

    // 시퀀스 종료 처리 (착륙 및 코딩끝 카드 누락 검사)
    const hasLanding = cards.some(c => c.action.type === 'LANDING');
    const hasEndCoding = cards.some(c => c.action.type === 'END');

    this.isRunning = false;
    if (this.onCardHighlight) this.onCardHighlight(-1);
    if (this.onComplete) this.onComplete({ hasLanding, hasEndCoding, isStillHovering: !this.state.isLanded });
  }

  stop() {
    this.isRunning = false;
    audioSystem.stopMotor();
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.resetState();
  }

  // 단일 카드 스텝 연출 애니메이션
  executeCard(card) {
    return new Promise((resolve) => {
      const action = card.action;
      const baseDuration = 1000 / this.speedMultiplier;

      // 1. 이륙 (Takeoff)
      if (action.type === 'TAKEOFF') {
        audioSystem.startMotor();
        this.state.isLanded = false;
        this.animateValue('z', 0, 1.0, baseDuration * 1.5, resolve);
      }
      // 2. 착륙 (Landing)
      else if (action.type === 'LANDING') {
        const startZ = this.state.z;
        this.animateValue('z', startZ, 0, baseDuration * 1.5, () => {
          this.state.isLanded = true;
          audioSystem.stopMotor();
          resolve();
        });
      }
      // 3. 정지 대기 (Wait)
      else if (action.type === 'WAIT') {
        const waitTime = (action.duration || 1) * baseDuration;
        setTimeout(resolve, waitTime);
      }
      // 4. 평면 이동 (Move)
      else if (action.type === 'MOVE') {
        if (this.state.isLanded) {
          // 착륙 상태면 자동 경고음 후 무시 또는 자동 이륙
          audioSystem.playBuzzer(1);
          setTimeout(resolve, 300);
          return;
        }

        const distance = action.distance || 1;
        const rad = (this.state.heading * Math.PI) / 180;
        let dx = 0;
        let dy = 0;

        if (action.direction === 'FORWARD') {
          dx = Math.sin(rad) * distance;
          dy = Math.cos(rad) * distance;
        } else if (action.direction === 'BACKWARD') {
          dx = -Math.sin(rad) * distance;
          dy = -Math.cos(rad) * distance;
        } else if (action.direction === 'LEFT') {
          dx = -Math.cos(rad) * distance;
          dy = Math.sin(rad) * distance;
        } else if (action.direction === 'RIGHT') {
          dx = Math.cos(rad) * distance;
          dy = -Math.sin(rad) * distance;
        }

        const startX = this.state.x;
        const startY = this.state.y;
        const targetX = startX + dx;
        const targetY = startY + dy;

        this.animatePosition(startX, startY, targetX, targetY, baseDuration * distance * 0.8, resolve);
      }
      // 5. 고도 제어 (Altitude)
      else if (action.type === 'ALTITUDE') {
        if (this.state.isLanded) {
          setTimeout(resolve, 300);
          return;
        }
        const change = action.change || 0;
        const startZ = this.state.z;
        const targetZ = Math.max(0.5, Math.min(3.0, startZ + change * 0.5));
        this.animateValue('z', startZ, targetZ, baseDuration, resolve);
      }
      // 6. 회전 제어 (Rotate)
      else if (action.type === 'ROTATE') {
        if (this.state.isLanded) {
          setTimeout(resolve, 300);
          return;
        }
        const angle = action.angle || 0;
        const startHeading = this.state.heading;
        const targetHeading = (startHeading + angle + 3600) % 360;
        
        this.animateValue('heading', startHeading, startHeading + angle, baseDuration, () => {
          this.state.heading = targetHeading;
          if (this.onStateUpdate) this.onStateUpdate(this.state);
          resolve();
        });
      }
      // 7. 특수 플립 (Flip)
      else if (action.type === 'FLIP') {
        if (this.state.isLanded) {
          setTimeout(resolve, 300);
          return;
        }
        audioSystem.playFlipSound();
        this.animateValue('flipAngle', 0, 360, baseDuration * 0.8, () => {
          this.state.flipAngle = 0;
          if (this.onStateUpdate) this.onStateUpdate(this.state);
          resolve();
        });
      }
      // 8. LED 조명 효과
      else if (action.type === 'LED') {
        this.state.ledColor = action.color;
        if (this.onStateUpdate) this.onStateUpdate(this.state);
        setTimeout(resolve, 300 / this.speedMultiplier);
      }
      // 9. 부저 소리
      else if (action.type === 'BEEPER') {
        audioSystem.playBuzzer(action.count || 1);
        setTimeout(resolve, (action.count || 1) * 200 / this.speedMultiplier);
      }
      else {
        // 기타 시작/끝 등
        setTimeout(resolve, 200 / this.speedMultiplier);
      }
    });
  }

  // 단일 프라퍼티 애니메이션 (Easing)
  animateValue(key, startVal, targetVal, duration, callback) {
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Ease-in-out

      this.state[key] = startVal + (targetVal - startVal) * ease;
      if (this.onStateUpdate) this.onStateUpdate(this.state);

      if (progress < 1 && this.isRunning) {
        this.animFrameId = requestAnimationFrame(step);
      } else {
        callback();
      }
    };
    this.animFrameId = requestAnimationFrame(step);
  }

  // 2D 위치 좌표 부드러운 이동
  animatePosition(startX, startY, targetX, targetY, duration, callback) {
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      this.state.x = startX + (targetX - startX) * ease;
      this.state.y = startY + (targetY - startY) * ease;

      // 궤적 기록
      this.state.trail.push({ x: this.state.x, y: this.state.y, z: this.state.z });
      if (this.state.trail.length > 300) this.state.trail.shift();

      if (this.onStateUpdate) this.onStateUpdate(this.state);

      if (progress < 1 && this.isRunning) {
        this.animFrameId = requestAnimationFrame(step);
      } else {
        callback();
      }
    };
    this.animFrameId = requestAnimationFrame(step);
  }
}
