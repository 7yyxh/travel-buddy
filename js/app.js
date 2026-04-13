/**
 * app.js - 应用主入口、路由、全局状态
 */
const App = {
  state: {
    phase: 'landing', // landing | quiz | share | result
    role: null,        // 'A' | 'B'
    answers: {},       // { questionId: optionIndex }
    partnerData: null,  // B用户时存储A的数据
    result: null
  },

  init() {
    const partnerData = ShareHelper.parseFromURL();
    if (partnerData) {
      App.state.role = 'B';
      App.state.partnerData = partnerData;
    }
    App.render();
  },

  setState(updates) {
    Object.assign(App.state, updates);
    App.render();
  },

  /** 重置到初始页（清除URL中的邀请参数） */
  resetToHome() {
    // 清掉URL中?d=xxx，避免B用户还停留在A的邀请中
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    App.state = {
      phase: 'landing',
      role: null,
      answers: {},
      partnerData: null,
      result: null
    };
    App.render();
  },

  render() {
    const container = document.getElementById('app');
    let html = '';

    switch (App.state.phase) {
      case 'landing':
        html = Pages.landing();
        break;
      case 'quiz':
        html = Pages.quiz();
        break;
      case 'share':
        html = Pages.sharePage();
        break;
      case 'result':
        html = Pages.result();
        break;
    }

    container.innerHTML = html;

    requestAnimationFrame(() => {
      const page = container.querySelector('.page');
      if (page) page.classList.add('active');
    });

    App.bindEvents();
  },

  bindEvents() {}
};

document.addEventListener('DOMContentLoaded', () => App.init());
