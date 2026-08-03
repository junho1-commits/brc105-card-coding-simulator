// BRC-105 Side View (측면도 / 옆에서 본 뷰) Canvas Renderer
export class SideViewRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.altitudeScale = 70; // 1미터당 70픽셀
    this.propellerAngle = 0;
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = Math.max(300, rect.height);
  }

  render(droneState) {
    if (!this.ctx) return;
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    if (!droneState.isLanded) {
      this.propellerAngle += 0.35;
    }

    // 1. 배경 (하늘 및 실내 배경 다크 블루 그래디언트)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#090d16');
    bgGradient.addColorStop(0.8, '#1e293b');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. 바닥 지면 (Ground Plane)
    const groundY = height - 40;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, width, 40);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // 3. 고도 가이드 눈금선 (0m, 1m, 2m, 3m)
    ctx.lineWidth = 1;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    for (let alt = 1; alt <= 3; alt++) {
      const lineY = groundY - alt * this.altitudeScale;
      if (lineY > 0) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(40, lineY);
        ctx.lineTo(width - 20, lineY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#64748b';
        ctx.fillText(`${alt}.0m`, 34, lineY + 4);
      }
    }
    ctx.fillText('0.0m (지면)', 34, groundY - 6);

    // 4. 드론 픽셀 위치 계산
    // Side View에서는 X축 위치 (또는 복합 거리) + Z축 고도
    const dronePx = width / 2 + (droneState.x * 30); 
    const dronePy = groundY - (droneState.z * this.altitudeScale) - 15; // 15는 랜딩 기어 높이 offset

    // 5. 드론 측면 실루엣 (Side Profile)
    ctx.save();
    ctx.translate(dronePx, dronePy);

    // 플립(Flip) 동작 애니메이션 회전
    if (droneState.flipAngle) {
      ctx.rotate((droneState.flipAngle * Math.PI) / 180);
    }

    // 드론 메인 섀시
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-24, -8, 48, 14, 4);
    ctx.fill();
    ctx.stroke();

    // 상단 돔 및 센서 커버
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -8, 12, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // 랜딩 스키드 (하단 받침대)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, 6);
    ctx.lineTo(-18, 14);
    ctx.lineTo(-12, 14);
    ctx.moveTo(18, 6);
    ctx.lineTo(18, 14);
    ctx.lineTo(12, 14);
    ctx.stroke();

    // 하단 컬러 센서 (실물 BRC-105 컬러 센서 렌더링)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-6, 6, 12, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-4, 8, 8, 2);

    // 2개 측면 프로펠러 블레이드 & 모터
    const props = [-22, 22];
    props.forEach(px => {
      // 모터 팟
      ctx.fillStyle = '#475569';
      ctx.fillRect(px - 3, -12, 6, 6);

      // 프로펠러 회전 블레이드 잔상
      ctx.save();
      ctx.translate(px, -12);
      ctx.scale(Math.cos(this.propellerAngle), 1);
      ctx.fillStyle = droneState.isLanded ? 'rgba(148, 163, 184, 0.4)' : 'rgba(56, 189, 248, 0.7)';
      ctx.fillRect(-14, -2, 28, 3);
      ctx.restore();
    });

    // 드론 LED 발광 모듈 (앞/뒤/중앙)
    if (droneState.ledColor !== 'off') {
      ctx.fillStyle = droneState.ledColor;
      ctx.shadowColor = droneState.ledColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // 6. 비행 상태 및 고도 정보 Overlay 텍스트
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Side View (측면도) | 고도: ${droneState.z.toFixed(2)}m | 상태: ${droneState.isLanded ? '지면 착륙' : '공중 비행 중'}`, 12, 24);
  }
}
