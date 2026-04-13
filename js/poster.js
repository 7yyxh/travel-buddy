/**
 * poster.js - Canvas 海报图片生成
 */

// roundRect polyfill
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = [r, r, r, r];
    const [tl, tr, br, bl] = r;
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

const Poster = {
  show() {
    const r = App.state.result;
    if (!r) return;

    const partnerData = App.state.partnerData;

    // 创建遮罩
    let modal = document.getElementById('poster-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'poster-modal';
      modal.className = 'poster-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="poster-content">
        <canvas id="poster-canvas"></canvas>
        <button class="btn btn-primary btn-block" onclick="Poster.save()">保存海报</button>
        <button class="btn btn-secondary btn-block" style="margin-top:8px" onclick="Poster.close()">关闭</button>
      </div>
    `;

    // 绘制海报
    setTimeout(() => this.draw(r, partnerData), 50);
    requestAnimationFrame(() => modal.classList.add('show'));
  },

  draw(result, partnerData) {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 360;
    const h = 640;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    // 背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // 顶部装饰条
    const topGrad = ctx.createLinearGradient(0, 0, w, 0);
    topGrad.addColorStop(0, '#2D3748');
    topGrad.addColorStop(1, '#718096');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, 6);

    // 标题
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('最佳旅游搭子测试', w / 2, 50);

    // 分数
    ctx.font = 'bold 64px -apple-system, sans-serif';
    ctx.fillStyle = '#2D3748';
    ctx.fillText(result.totalScore + '%', w / 2, 140);

    // 标签
    ctx.font = 'bold 22px -apple-system, sans-serif';
    const tier = result.tier;
    const tagW = ctx.measureText(tier.tag).width + 40;

    const tagX = (w - tagW) / 2;
    ctx.fillStyle = tier.color;
    ctx.beginPath();
    ctx.roundRect(tagX, 155, tagW, 40, 20);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(tier.tag, w / 2, 182);

    // 描述
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillStyle = '#718096';
    this.wrapText(ctx, tier.desc, w / 2, 215, w - 60, 18);

    // 维度分数
    let y = 270;
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillStyle = '#2C3E50';
    ctx.textAlign = 'left';
    ctx.fillText('各维度匹配度', 30, y);
    y += 22;

    ctx.font = '13px -apple-system, sans-serif';
    Questions.getDimensionKeys().forEach(dim => {
      const score = result.dimScores[dim] || 0;
      const dimInfo = Dimensions[dim];

      // 维度名
      ctx.fillStyle = '#2C3E50';
      ctx.textAlign = 'left';
      ctx.fillText(dimInfo.name, 30, y);

      // 进度条背景
      const barX = 110;
      const barW = 160;
      const barH = 8;
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath();
      ctx.roundRect(barX, y - 6, barW, barH, 4);
      ctx.fill();

      // 进度条填充
      const fillW = barW * (score / 100);
      const barColor = score >= 70 ? '#718096' : score >= 40 ? '#A0AEC0' : '#CBD5E0';
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(barX, y - 6, fillW, barH, 4);
      ctx.fill();

      // 分数
      ctx.fillStyle = '#2D3748';
      ctx.textAlign = 'right';
      ctx.fillText(score + '%', w - 30, y);

      y += 28;
    });

    // 底部
    ctx.fillStyle = '#bbb';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('扫码来测你和TA的旅行适配度', w / 2, h - 50);

    ctx.fillStyle = '#ddd';
    ctx.fillText('✈️ 你们是最佳旅游搭子吗？', w / 2, h - 30);
  },

  save() {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = '旅行搭子适配度.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  close() {
    const modal = document.getElementById('poster-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  },

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let line = '';
    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = text[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
};
