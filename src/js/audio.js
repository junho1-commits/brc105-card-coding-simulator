// Web Audio API를 활용한 BRC-105 실감형 통합 사운드 시스템
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.motorOsc = null;
    this.motorGain = null;
    this.isMotorRunning = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 카드 클릭/슬롯 장착 사운드
  playCardClick() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // BRC-105 비프 부저음
  playBuzzer(count = 1) {
    this.init();
    for (let i = 0; i < count; i++) {
      const startTime = this.ctx.currentTime + i * 0.18;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.setValueAtTime(0, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    }
  }

  // 드론 모터 비행 엔진음 제어
  startMotor() {
    this.init();
    if (this.isMotorRunning) return;

    this.motorOsc = this.ctx.createOscillator();
    this.motorGain = this.ctx.createGain();

    // 프로펠러 왜곡 및 저음 진동 조합
    this.motorOsc.type = 'sawtooth';
    this.motorOsc.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.motorGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.motorGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.5);

    this.motorOsc.connect(this.motorGain);
    this.motorGain.connect(this.ctx.destination);

    this.motorOsc.start();
    this.isMotorRunning = true;
  }

  setMotorSpeed(speedPitch) {
    if (this.motorOsc && this.isMotorRunning) {
      const freq = 140 * speedPitch;
      this.motorOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
  }

  stopMotor() {
    if (this.motorGain && this.isMotorRunning) {
      this.motorGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        if (this.motorOsc) {
          try { this.motorOsc.stop(); } catch(e) {}
          this.motorOsc.disconnect();
        }
        this.isMotorRunning = false;
      }, 400);
    }
  }

  // 공중 플립 회전 사운드
  playFlipSound() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // 성공 축하 사운드
  playSuccess() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }
}

export const audioSystem = new SoundSystem();
