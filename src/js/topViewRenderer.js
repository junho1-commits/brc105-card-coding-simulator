// BRC-105 Top View (조감도 / 위에서 본 뷰) Canvas Renderer
export class TopViewRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = 40; // 1미터/1칸당 40픽셀
    this.centerX = 150;
    this.centerY = 150;
    this.propellerAngle = 0;
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth || 300 : 300;
    const height = parent ? parent.clientHeight || 250 : 250;

    this.canvas.width = Math.max(150, width);
    this.canvas.height = Math.max(150, height);
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  // 둥근 사각형 브라우저 호환 함수 (roundRect 폴리필)
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

    // 프로펠러 애니메이션 각도 증가
    if (!droneState.isLanded) {
      this.propellerAngle += 0.35;
    }

    // 1. 배경 클리어 (다크 사이버 맵)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // 2. 그리드 격자선
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';

    const startX = (this.centerX % this.gridSize);
    for (let x = startX; x < width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const startY = (this.centerY % this.gridSize);
    for (let y = startY; y < height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. 십자 원점 메인 축
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.beginPath();
    ctx.moveTo(this.centerX, 0);
    ctx.lineTo(this.centerX, height);
    ctx.moveTo(0, this.centerY);
    ctx.lineTo(width, this.centerY);
    ctx.stroke();

    // 4. 비행 궤적 (Trail Line)
    if (droneState.trail && droneState.trail.length > 1) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = droneState.ledColor !== 'off' ? droneState.ledColor : '#38bdf8';
      ctx.shadowColor = droneState.ledColor !== 'off' ? droneState.ledColor : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      droneState.trail.forEach((pt, idx) => {
        const px = this.centerX + pt.x * this.gridSize;
        const py = this.centerY - pt.y * this.gridSize;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. 미션 목표 타겟 마커
    if (droneState.targetPos) {
      const targetPx = this.centerX + droneState.targetPos.x * this.gridSize;
      const targetPy = this.centerY - droneState.targetPos.y * this.gridSize;

      ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetPx, targetPy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎯 목표', targetPx, targetPy - 26);
    }

    // 6. 착륙 지점 / 홈 마크
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('H', this.centerX, this.centerY + 4);

    // 7. 드론 위치 계산
    const dronePx = this.centerX + (droneState.x || 0) * this.gridSize;
    const dronePy = this.centerY - (droneState.y || 0) * this.gridSize;

    // 8. 드론 본체 렌더링 (Top-down View)
    ctx.save();
    ctx.translate(dronePx, dronePy);
    ctx.rotate(((droneState.heading || 0) * Math.PI) / 180);

    const armLength = 22;
    const propRadius = 14;

    // 4개 프로펠러 암
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-armLength, -armLength);
    ctx.lineTo(armLength, armLength);
    ctx.moveTo(armLength, -armLength);
    ctx.lineTo(-armLength, armLength);
    ctx.stroke();

    // 4개 모터 팟 및 회전 프로펠러
    const props = [
      { x: -armLength, y: -armLength, isFront: true, color: '#ef4444' },
      { x: armLength, y: -armLength, isFront: true, color: '#ef4444' },
      { x: -armLength, y: armLength, isFront: false, color: '#3b82f6' },
      { x: armLength, y: armLength, isFront: false, color: '#3b82f6' }
    ];

    props.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.isFront ? this.propellerAngle : -this.propellerAngle);
      ctx.fillStyle = droneState.isLanded ? 'rgba(148, 163, 184, 0.4)' : 'rgba(56, 189, 248, 0.7)';
      ctx.beginPath();
      ctx.ellipse(0, 0, propRadius, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 0, 4, propRadius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 드론 메인 센터 바디
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    this.drawRoundRect(ctx, -12, -14, 24, 28, 6);
    ctx.fill();
    ctx.stroke();

    // 정면 헤드 라이트
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-7, -10);
    ctx.lineTo(7, -10);
    ctx.closePath();
    ctx.fill();

    // 센터 LED 발광 라이트
    if (droneState.ledColor && droneState.ledColor !== 'off') {
      ctx.fillStyle = droneState.ledColor;
      ctx.shadowColor = droneState.ledColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // 9. Overlay 텍스트
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Top View (조감도) | X: ${(droneState.x||0).toFixed(1)}m | Y: ${(droneState.y||0).toFixed(1)}m | 각도: ${Math.round(droneState.heading||0)}°`, 10, 20);
  }
}
