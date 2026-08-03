// BRC-105 Side View (측면도 / 옆에서 본 뷰) Canvas Renderer
export class SideViewRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.altitudeScale = 70; // 1미터당 70픽셀
    this.propellerAngle = 0;
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth || 300 : 300;
    const height = parent ? parent.clientHeight || 250 : 250;

    this.canvas.width = Math.max(150, width);
    this.canvas.height = Math.max(150, height);
  }

  drawRoundRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  render(droneState) {
    if (!this.ctx || !droneState) return;
    const width = this.canvas.width || 300;
    const height = this.canvas.height || 250;
    const ctx = this.ctx;

    if (!droneState.isLanded) {
      this.propellerAngle += 0.35;
    }

    // 1. 배경
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
    const dronePx = width / 2 + ((droneState.x || 0) * 30);
    const dronePy = groundY - ((droneState.z || 0) * this.altitudeScale) - 15;

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
    ctx.lineWidth = 2.5;
    this.drawRoundRect(ctx, -24, -8, 48, 14, 4);
    ctx.fill();
    ctx.stroke();

    // 상단 돔
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -8, 12, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // 랜딩 스키드
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

    // 하단 컬러 센서
    ctx.fillStyle = '#000000';
    ctx.fillRect(-6, 6, 12, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-4, 8, 8, 2);

    // 2개 측면 프로펠러
    const props = [-22, 22];
    props.forEach(px => {
      ctx.fillStyle = '#475569';
      ctx.fillRect(px - 3, -12, 6, 6);

      ctx.save();
      ctx.translate(px, -12);
      ctx.scale(Math.cos(this.propellerAngle), 1);
      ctx.fillStyle = droneState.isLanded ? 'rgba(148, 163, 184, 0.4)' : 'rgba(56, 189, 248, 0.7)';
      ctx.fillRect(-14, -2, 28, 3);
      ctx.restore();
    });

    // 드론 LED 발광 모듈
    if (droneState.ledColor && droneState.ledColor !== 'off') {
      ctx.fillStyle = droneState.ledColor;
      ctx.shadowColor = droneState.ledColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // 6. Overlay 텍스트
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Side View (측면도) | 고도: ${(droneState.z||0).toFixed(2)}m | 상태: ${droneState.isLanded ? '지면 착륙' : '공중 비행 중'}`, 10, 20);
  }
}
