import { CARD_CATEGORIES, BRC_CARDS, SAMPLE_PROGRAMS, MISSIONS } from './cardsData.js';
import { audioSystem } from './audio.js';
import { TopViewRenderer } from './topViewRenderer.js';
import { SideViewRenderer } from './sideViewRenderer.js';
import { DroneInterpreter } from './interpreter.js';

class CardCodingApp {
  constructor() {
    this.currentCategory = 'all';
    this.slottedCards = [];
    this.speedMultiplier = 1.0;
    this.activeStepIndex = -1;
    this.currentMission = null;

    // DOM Elements
    this.categoryTabsEl = document.getElementById('categoryTabs');
    this.cardsGridEl = document.getElementById('cardsGrid');
    this.slotsContainerEl = document.getElementById('slotsContainer');
    this.sampleSelectEl = document.getElementById('sampleSelect');
    this.missionSelectEl = document.getElementById('missionSelect');

    this.missionTitleEl = document.getElementById('missionTitle');
    this.missionDiffEl = document.getElementById('missionDiff');
    this.missionGoalEl = document.getElementById('missionGoal');
    this.btnMissionHintEl = document.getElementById('btnMissionHint');

    this.btnRun = document.getElementById('btnRun');
    this.btnStop = document.getElementById('btnStop');
    this.btnResetSlot = document.getElementById('btnResetSlot');
    this.btnHelp = document.getElementById('btnHelp');

    this.telemetryAlt = document.getElementById('telemetryAlt');
    this.telemetryHeading = document.getElementById('telemetryHeading');
    this.telemetryLed = document.getElementById('telemetryLed');
    this.statusText = document.getElementById('statusText');

    // Canvas Renderers
    this.topViewCanvas = document.getElementById('topViewCanvas');
    this.sideViewCanvas = document.getElementById('sideViewCanvas');

    this.topRenderer = new TopViewRenderer(this.topViewCanvas);
    this.sideRenderer = new SideViewRenderer(this.sideViewCanvas);

    // Interpreter
    this.interpreter = new DroneInterpreter(
      this.onDroneStateUpdate.bind(this),
      this.onCardHighlight.bind(this),
      this.onExecutionComplete.bind(this)
    );

    // Completed Missions & Student Name State
    this.completedMissions = new Set(JSON.parse(localStorage.getItem('brc_completed_missions') || '[]'));
    this.studentName = localStorage.getItem('brc_student_name') || '';

    this.btnCertificate = document.getElementById('btnCertificate');
    this.studentNameModal = document.getElementById('studentNameModal');
    this.studentNameInput = document.getElementById('studentNameInput');
    this.btnSaveName = document.getElementById('btnSaveName');

    this.certificateModal = document.getElementById('certificateModal');
    this.certRecipientName = document.getElementById('certRecipientName');
    this.certNo = document.getElementById('certNo');
    this.certDate = document.getElementById('certDate');
    this.btnPrintCert = document.getElementById('btnPrintCert');
    this.btnCloseCert = document.getElementById('btnCloseCert');

    this.init();
  }

  init() {
    this.renderCategoryTabs();
    this.renderCardsGrid();
    this.renderSampleOptions();
    this.renderMissionOptions();
    this.bindEvents();
    this.initRenderers();
    this.checkCertificateStatus();
  }

  checkCertificateStatus() {
    if (this.completedMissions.size >= MISSIONS.length && this.studentName) {
      this.btnCertificate.classList.remove('hidden');
    }
  }

  openCertificateModal() {
    this.certRecipientName.textContent = this.studentName || '홍길동';
    this.certNo.textContent = `BRC-2026-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    this.certDate.textContent = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    this.certificateModal.classList.remove('hidden');
  }

  // 1. 카테고리 탭 렌더링
  renderCategoryTabs() {
    this.categoryTabsEl.innerHTML = CARD_CATEGORIES.map(cat => `
      <button class="cat-tab ${cat.id === this.currentCategory ? 'active' : ''}" data-cat="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    this.categoryTabsEl.querySelectorAll('.cat-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentCategory = e.currentTarget.dataset.cat;
        this.renderCategoryTabs();
        this.renderCardsGrid();
        audioSystem.playCardClick();
      });
    });
  }

  // 2. 실물 모양 BRC-105 카드 라이브러리 렌더링
  renderCardsGrid() {
    const filteredCards = this.currentCategory === 'all'
      ? BRC_CARDS
      : BRC_CARDS.filter(c => c.category === this.currentCategory);

    this.cardsGridEl.innerHTML = filteredCards.map(card => this.createPhysicalCardHTML(card)).join('');

    this.cardsGridEl.querySelectorAll('.physical-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const cardId = cardEl.dataset.id;
        const cardObj = BRC_CARDS.find(c => c.id === cardId);
        if (cardObj) {
          this.addCardToSlot(cardObj);
          audioSystem.playCardClick();
        }
      });
    });
  }

  createPhysicalCardHTML(card) {
    const sensorHtml = card.sensorCode
      ? card.sensorCode.map(c => `<div class="sensor-seg" style="background:${c}"></div>`).join('')
      : '';

    return `
      <div class="physical-card" data-id="${card.id}" style="--card-brand-color: ${card.color}; --card-bg-gradient: ${card.bgGradient};">
        <div class="card-header-cap">
          <span>BRC-105</span>
          <span class="card-code">${card.code}</span>
        </div>
        <div class="card-body-graphic">
          <div class="card-main-icon">${card.icon}</div>
          <div class="card-title-ko">${card.name}</div>
          <div class="card-title-en">${card.nameEn}</div>
        </div>
        <div class="card-sensor-bar">
          ${sensorHtml}
        </div>
      </div>
    `;
  }

  // 3. 슬롯 트레이 카드 추가 및 관리
  addCardToSlot(card) {
    this.slottedCards.push(card);
    this.renderSlots();
  }

  removeCardFromSlot(index) {
    this.slottedCards.splice(index, 1);
    this.renderSlots();
    audioSystem.playCardClick();
  }

  moveCardInSlot(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.slottedCards.length) return;
    const temp = this.slottedCards[index];
    this.slottedCards[index] = this.slottedCards[targetIdx];
    this.slottedCards[targetIdx] = temp;
    this.renderSlots();
    audioSystem.playCardClick();
  }

  renderSlots() {
    if (this.slottedCards.length === 0) {
      this.slotsContainerEl.innerHTML = `
        <div class="empty-slot-msg">
          <span>🎴 카드를 선택하거나 클릭하여 여기에 배열하세요</span>
          <p>기본 추천: [코딩 시작] ➔ [이륙] ➔ [이동/회전] ➔ [착륙] ➔ [코딩 끝]</p>
        </div>
      `;
      return;
    }

    this.slotsContainerEl.innerHTML = this.slottedCards.map((card, idx) => `
      <div class="slot-card-wrapper ${idx === this.activeStepIndex ? 'active-step' : ''}">
        ${this.createPhysicalCardHTML(card)}
        <div class="slot-actions">
          <button class="btn-slot-icon btn-move-left" data-idx="${idx}">◀</button>
          <button class="btn-slot-icon btn-remove" data-idx="${idx}">✖</button>
          <button class="btn-slot-icon btn-move-right" data-idx="${idx}">▶</button>
        </div>
      </div>
    `).join('');

    this.slotsContainerEl.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeCardFromSlot(parseInt(btn.dataset.idx));
      });
    });

    this.slotsContainerEl.querySelectorAll('.btn-move-left').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.moveCardInSlot(parseInt(btn.dataset.idx), -1);
      });
    });

    this.slotsContainerEl.querySelectorAll('.btn-move-right').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.moveCardInSlot(parseInt(btn.dataset.idx), 1);
      });
    });
  }

  // 4. 예시 프로그래밍 로드
  renderSampleOptions() {
    this.sampleSelectEl.innerHTML = `<option value="">📜 예시 코스 선택...</option>` +
      SAMPLE_PROGRAMS.map(sp => `<option value="${sp.id}">${sp.title}</option>`).join('');

    this.sampleSelectEl.addEventListener('change', (e) => {
      const sampleId = e.target.value;
      if (!sampleId) return;
      this.missionSelectEl.value = '';
      this.currentMission = null;
      this.btnMissionHintEl.classList.add('hidden');
      this.missionDiffEl.textContent = '🎯 미션 모드';
      this.missionTitleEl.textContent = '도전할 미션을 상단에서 선택하세요!';
      this.missionGoalEl.innerHTML = '상단 <strong style="color: var(--accent-cyan);">[🎯 미션 도전 과제 선택...]</strong> 메뉴에서 미션을 선택하면 이곳에 목표가 커다랗게 나타납니다!';
      this.interpreter.state.targetPos = null;

      const sample = SAMPLE_PROGRAMS.find(s => s.id === sampleId);
      if (sample) {
        this.slottedCards = sample.cardIds.map(id => BRC_CARDS.find(c => c.id === id)).filter(Boolean);
        this.renderSlots();
        audioSystem.playCardClick();
      }
    });
  }

  // 미션 도전 과제 로드
  renderMissionOptions() {
    this.missionSelectEl.innerHTML = `<option value="">🎯 미션 도전 과제 선택...</option>` +
      MISSIONS.map(m => `<option value="${m.id}">${m.difficulty} | ${m.title}</option>`).join('');

    this.missionSelectEl.addEventListener('change', (e) => {
      const missionId = e.target.value;
      if (!missionId) {
        this.currentMission = null;
        this.btnMissionHintEl.classList.add('hidden');
        this.missionDiffEl.textContent = '🎯 미션 모드';
        this.missionTitleEl.textContent = '도전할 미션을 상단에서 선택하세요!';
        this.missionGoalEl.innerHTML = '상단 <strong style="color: var(--accent-cyan);">[🎯 미션 도전 과제 선택...]</strong> 메뉴에서 미션을 선택하면 이곳에 목표가 커다랗게 나타납니다!';
        this.interpreter.state.targetPos = null;
        return;
      }
      this.sampleSelectEl.value = '';
      const mission = MISSIONS.find(m => m.id === missionId);
      if (mission) {
        this.currentMission = mission;
        this.missionTitleEl.textContent = mission.title;
        this.missionDiffEl.textContent = mission.difficulty;
        this.missionGoalEl.textContent = mission.goalText;
        this.btnMissionHintEl.classList.remove('hidden');

        if (mission.targetX !== undefined) {
          this.interpreter.state.targetPos = { x: mission.targetX, y: mission.targetY };
        } else {
          this.interpreter.state.targetPos = null;
        }

        audioSystem.playCardClick();
      }
    });

    this.btnMissionHintEl.addEventListener('click', () => {
      if (this.currentMission) {
        alert(`💡 [${this.currentMission.title}] 힌트:\n\n${this.currentMission.hint}`);
      }
    });
  }

  initRenderers() {
    const handleResize = () => {
      this.topRenderer.resize();
      this.sideRenderer.resize();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const renderLoop = () => {
      this.topRenderer.render(this.interpreter.state);
      this.sideRenderer.render(this.interpreter.state);
      requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);
  }

  onDroneStateUpdate(state) {
    this.telemetryAlt.textContent = `${state.z.toFixed(2)}m`;
    this.telemetryHeading.textContent = `${Math.round(state.heading)}°`;
    this.telemetryLed.textContent = state.ledColor.toUpperCase();
    this.telemetryLed.style.color = state.ledColor !== 'off' ? state.ledColor : '#94a3b8';
  }

  onCardHighlight(index) {
    this.activeStepIndex = index;
    this.renderSlots();
  }

  onExecutionComplete(result = {}) {
    this.btnRun.disabled = false;
    this.btnStop.disabled = true;

    if (result.isStillHovering) {
      this.statusText.innerHTML = '<span style="color: #f59e0b;">⚠️ 착륙 카드 누락! (공중 정지 대기 중)</span>';
      audioSystem.playBuzzer(2);
      return;
    }

    if (this.currentMission) {
      const parsedQueue = this.interpreter.parseProgram(this.slottedCards);
      const isSuccess = this.currentMission.validate(this.interpreter.state, parsedQueue);

      if (isSuccess) {
        audioSystem.playSuccess();
        this.completedMissions.add(this.currentMission.id);
        localStorage.setItem('brc_completed_missions', JSON.stringify([...this.completedMissions]));

        const isAllDone = this.completedMissions.size >= MISSIONS.length;

        this.statusText.innerHTML = `<span style="color: #10b981; font-weight: 800;">🎉 미션 성공! (${this.completedMissions.size}/${MISSIONS.length} 완수)</span>`;

        setTimeout(() => {
          if (isAllDone) {
            if (!this.studentName) {
              this.studentNameModal.classList.remove('hidden');
            } else {
              this.checkCertificateStatus();
              this.openCertificateModal();
            }
          } else {
            alert(`🎉 축하합니다!\n\n[${this.currentMission.title}] 미션을 성공적으로 완수하셨습니다! 🏆\n(남은 미션: ${MISSIONS.length - this.completedMissions.size}개)`);
          }
        }, 300);
      } else {
        audioSystem.playBuzzer(2);
        this.statusText.innerHTML = '<span style="color: #ef4444;">❌ 미션 실패! 목표 조건을 다시 확인해보세요.</span>';
        setTimeout(() => {
          alert(`❌ 미션 실패!\n\n미션 목표 조건을 완수하지 못했습니다.\n💡 힌트 버튼을 눌러 카드를 다시 구성해보세요!`);
        }, 200);
      }
    } else {
      this.statusText.textContent = '비행 완료 (안전 착륙됨)';
      audioSystem.playSuccess();
    }
  }

  bindEvents() {
    this.btnRun.addEventListener('click', () => {
      if (this.slottedCards.length === 0) {
        alert('⚠️ 슬롯에 카드를 최소 1장 이상 추가해주세요!');
        audioSystem.playBuzzer(2);
        return;
      }

      const hasLanding = this.slottedCards.some(c => c.action && c.action.type === 'LANDING');
      const hasEndCoding = this.slottedCards.some(c => c.action && c.action.type === 'END');

      const missing = [];
      if (!hasLanding) missing.push('🛬 [착륙] 카드');
      if (!hasEndCoding) missing.push('🏁 [코딩 끝] 카드');

      if (missing.length > 0) {
        audioSystem.playBuzzer(2);
        alert(`🚨 비행을 시작할 수 없습니다!\n\n다음 필수 카드가 누락되었습니다:\n${missing.join('\n')}\n\n슬롯에 카드를 추가한 후 다시 시작해주세요.`);
        this.statusText.innerHTML = `<span style="color: #ef4444;">🚨 실행 불가 (${missing.join(', ')} 누락)</span>`;
        return;
      }

      this.btnRun.disabled = true;
      this.btnStop.disabled = false;
      this.statusText.textContent = '비행 연출 중...';
      this.interpreter.run(this.slottedCards, this.speedMultiplier);
    });

    this.btnStop.addEventListener('click', () => {
      this.interpreter.stop();
      this.btnRun.disabled = false;
      this.btnStop.disabled = true;
      this.statusText.textContent = '비행 중지됨';
    });

    this.btnResetSlot.addEventListener('click', () => {
      this.interpreter.stop();
      this.slottedCards = [];
      this.renderSlots();
      audioSystem.playCardClick();
    });

    document.querySelectorAll('.btn-speed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.speedMultiplier = parseFloat(e.currentTarget.dataset.speed);
        if (this.interpreter.isRunning) {
          this.interpreter.speedMultiplier = this.speedMultiplier;
        }
      });
    });

    this.btnSaveName.addEventListener('click', () => {
      const name = this.studentNameInput.value.trim();
      if (!name) {
        alert('학생 이름을 입력해 주세요!');
        return;
      }
      this.studentName = name;
      localStorage.setItem('brc_student_name', name);
      this.studentNameModal.classList.add('hidden');
      this.checkCertificateStatus();
      this.openCertificateModal();
    });

    this.btnCertificate.addEventListener('click', () => {
      this.openCertificateModal();
    });

    this.btnPrintCert.addEventListener('click', () => {
      window.print();
    });

    this.btnCloseCert.addEventListener('click', () => {
      this.certificateModal.classList.add('hidden');
    });

    this.btnHelp.addEventListener('click', () => {
      document.getElementById('helpModal').classList.remove('hidden');
    });

    document.getElementById('btnCloseModal').addEventListener('click', () => {
      document.getElementById('helpModal').classList.add('hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new CardCodingApp();
});
