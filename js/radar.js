/**
 * radar.js - Canvas 雷达图绘制
 */
const RadarChart = {
  colors: {
    grid: '#E2E8F0',
    label: '#2D3748',
    fillA: 'rgba(45, 55, 72, 0.2)',
    strokeA: 'rgba(45, 55, 72, 0.7)',
    fillB: 'rgba(113, 128, 150, 0.2)',
    strokeB: 'rgba(113, 128, 150, 0.7)'
  },

  /**
   * 绘制雷达图
   * @param {string} canvasId - canvas元素ID
   * @param {Object} scoresA - A的维度分数 { dim: score }
   * @param {Object} scoresB - B的维度分数
   */
  draw(canvasId, scoresA, scoresB) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement.clientWidth, 360);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 68;
    const dims = Questions.getDimensionKeys();
    const n = dims.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, size, size);

    // 绘制网格（3层）
    for (let level = 1; level <= 3; level++) {
      const r = (radius / 3) * level;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = startAngle + angleStep * i;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = this.colors.grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 绘制轴线
    dims.forEach((_, i) => {
      const angle = startAngle + angleStep * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = this.colors.grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 绘制数据区域
    if (scoresA) this.drawDataArea(ctx, cx, cy, radius, dims, scoresA, this.colors.fillA, this.colors.strokeA, startAngle, angleStep);
    if (scoresB) this.drawDataArea(ctx, cx, cy, radius, dims, scoresB, this.colors.fillB, this.colors.strokeB, startAngle, angleStep);

    // 绘制标签
    ctx.fillStyle = this.colors.label;
    ctx.font = '12px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    dims.forEach((dim, i) => {
      const angle = startAngle + angleStep * i;
      const labelR = radius + 28;
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);
      ctx.fillText(Dimensions[dim].name, x, y);
    });
  },

  drawDataArea(ctx, cx, cy, radius, dims, scores, fillColor, strokeColor, startAngle, angleStep) {
    const n = dims.length;
    ctx.beginPath();

    dims.forEach((dim, i) => {
      const value = (scores[dim] || 0) / 100;
      const r = radius * value;
      const angle = startAngle + angleStep * i;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制数据点
    dims.forEach((dim, i) => {
      const value = (scores[dim] || 0) / 100;
      const r = radius * value;
      const angle = startAngle + angleStep * i;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
    });
  }
};
