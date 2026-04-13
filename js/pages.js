/**
 * pages.js - 各页面渲染函数
 */
const Pages = {

  // ===== 落地页（A直接开始 / B有邀请提示） =====
  landing() {
    const isB = App.state.role === 'B';
    const invite = isB
      ? `<p style="font-size:15px;color:var(--secondary);margin-bottom:8px">你的朋友已经完成了测试</p>`
      : '';

    return `
      <div class="page">
        <div class="landing-hero">
          <span class="emoji-deco">✈️</span>
          <h1>你们是最佳旅游搭子吗？</h1>
          ${invite}
          <p class="subtitle">准备好开始测试了吗？<br>和你的朋友一起填个问卷，测测旅行适配度</p>
        </div>
        <button class="btn btn-primary btn-block" onclick="Pages.startQuiz()">
          开始测试吧
        </button>
      </div>
    `;
  },

  startQuiz() {
    if (!App.state.role) App.state.role = 'A';
    App.state.answers = {};
    App.setState({ phase: 'quiz' });
  },

  // ===== 问卷页 =====
  quiz() {
    const total = Questions.all.length;
    const answered = Object.keys(App.state.answers).length;
    const progress = (answered / total) * 100;

    const questionsHTML = Questions.all.map((q, index) => {
      const selected = App.state.answers[q.id];
      const optionsHTML = q.options.map((opt, i) => {
        const cls = selected === i ? 'option-btn selected' : 'option-btn';
        const otherStyle = (selected !== undefined && selected !== i) ? ' style="opacity:0.4"' : '';
        return `<button class="${cls}"${otherStyle} onclick="Pages.selectOption(${index}, ${i})">${opt.label}</button>`;
      }).join('');

      return `
        <div class="question-card" id="q-${index}">
          <div class="q-num">第 ${index + 1} 题</div>
          <div class="q-text">${q.text}</div>
          <div class="option-list">${optionsHTML}</div>
        </div>
      `;
    }).join('');

    const allDone = answered === total;

    return `
      <div class="page">
        <div class="quiz-progress-fixed" id="quiz-progress">
          <div class="progress-text">已答 ${answered} / ${total}</div>
          <div class="progress-bar"><div class="fill" style="width:${progress}%"></div></div>
        </div>
        <div class="quiz-scroll-area">
          ${questionsHTML}
          <div class="quiz-submit-wrap" id="quiz-submit" style="display:${allDone ? 'block' : 'none'}">
            <button class="btn btn-primary btn-block" onclick="Pages.submitQuiz()">查看结果</button>
          </div>
        </div>
      </div>
    `;
  },

  selectOption(questionIndex, optionIndex) {
    const q = Questions.all[questionIndex];
    App.state.answers[q.id] = optionIndex;

    const card = document.getElementById('q-' + questionIndex);
    if (card) {
      const btns = card.querySelectorAll('.option-btn');
      btns.forEach((btn, i) => {
        if (i === optionIndex) {
          btn.classList.add('selected');
          btn.style.opacity = '';
        } else {
          btn.classList.remove('selected');
          btn.style.opacity = '0.4';
        }
      });
    }

    const total = Questions.all.length;
    const answered = Object.keys(App.state.answers).length;
    const progressEl = document.getElementById('quiz-progress');
    if (progressEl) {
      progressEl.querySelector('.progress-text').textContent = `已答 ${answered} / ${total}`;
      progressEl.querySelector('.fill').style.width = ((answered / total) * 100) + '%';
    }

    if (answered === total) {
      const submitWrap = document.getElementById('quiz-submit');
      if (submitWrap) submitWrap.style.display = 'block';
    }
  },

  submitQuiz() {
    if (Object.keys(App.state.answers).length < Questions.all.length) return;

    if (App.state.role === 'A') {
      App.setState({ phase: 'share' });
    } else {
      const result = Algorithm.calculate(
        App.state.partnerData.q,
        App.state.answers
      );
      App.state.result = result;
      App.setState({ phase: 'result' });
    }
  },

  // ===== 分享页 =====
  sharePage() {
    const url = ShareHelper.generateURL(App.state.answers);

    return `
      <div class="page">
        <div class="share-section">
          <span class="emoji-deco" style="font-size:48px;display:block;margin-bottom:12px">🎉</span>
          <h2>你已答完全部题目！</h2>
          <p style="color:var(--text-light);font-size:14px;margin-bottom:20px">
            把链接发给你的朋友，TA也答完就能看结果了
          </p>
          <div class="share-link-box" id="share-url">${url}</div>
          <button class="btn btn-primary btn-block" id="copy-btn"
            onclick="Pages.copyShareLink(document.getElementById('share-url').textContent)">
            复制链接发给朋友
          </button>
          <button class="btn btn-secondary btn-block" style="margin-top:12px"
            onclick="App.resetToHome()">
            返回首页
          </button>
        </div>
      </div>
    `;
  },

  async copyShareLink(url) {
    const btn = document.getElementById('copy-btn');
    await ShareHelper.copyLink(url);
    btn.textContent = '已复制！';
    btn.style.background = 'var(--secondary)';
    setTimeout(() => {
      btn.textContent = '复制链接发给朋友';
      btn.style.background = '';
    }, 2000);
  },

  // ===== 结果页 =====
  result() {
    const r = App.state.result;
    const tier = r.tier;

    const dimHTML = Questions.getDimensionKeys().map(dimKey => {
      const score = r.dimScores[dimKey] || 0;
      const dimInfo = Dimensions[dimKey];
      const barColor = score >= 70 ? '#718096' :
                       score >= 40 ? '#A0AEC0' : '#CBD5E0';
      return `
        <div class="dimension-item">
          <div class="dim-header">
            <span class="dim-name">${dimInfo.name}</span>
            <span class="dim-score">${score}%</span>
          </div>
          <div class="dim-bar">
            <div class="fill" style="width:0%;background:${barColor}" data-target="${score}"></div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="page" id="result-page">
        <div class="result-hero">
          <div class="result-tag" style="background:${tier.color};color:#fff">${tier.tag}</div>
          <div class="result-desc">${tier.desc}</div>
          <div class="score-label">旅行适配度</div>
          <div class="score" id="score-num">0%</div>
        </div>

        <div class="radar-container">
          <canvas id="radar-canvas"></canvas>
        </div>

        <h3 style="font-size:16px;margin-bottom:8px">各维度匹配度</h3>
        <div class="dimension-list">${dimHTML}</div>

        <div class="result-actions">
          <button class="btn btn-primary btn-block" onclick="Poster.show()">生成结果海报</button>
          <button class="btn btn-secondary btn-block" onclick="App.resetToHome()">再测一次</button>
        </div>
      </div>
    `;
  }
};

// 结果页动画（只触发一次）
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => {
    const resultPage = document.getElementById('result-page');
    if (!resultPage || !App.state.result) return;
    if (resultPage.dataset.animated) return;
    resultPage.dataset.animated = '1';

    const r = App.state.result;

    const scoreEl = document.getElementById('score-num');
    if (scoreEl) Pages.animateNumber(scoreEl, 0, r.totalScore, 1200);

    setTimeout(() => {
      document.querySelectorAll('.dim-bar .fill').forEach(bar => {
        const target = bar.getAttribute('data-target');
        if (target) bar.style.width = target + '%';
      });
    }, 200);

    setTimeout(() => {
      RadarChart.draw('radar-canvas', r.dimScores, null);
    }, 300);
  });

  observer.observe(document.getElementById('app'), { childList: true, subtree: true });
});

Pages.animateNumber = function(el, start, end, duration) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * ease);
    el.textContent = current + '%';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
};
