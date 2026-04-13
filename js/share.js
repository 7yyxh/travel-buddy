/**
 * share.js - URL Base64 编解码，链接生成与解析
 */
const ShareHelper = {
  /**
   * 将用户A的答案编码到URL
   */
  generateURL(answers) {
    const data = { q: answers };
    const json = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    const base = window.location.origin + window.location.pathname;
    return base + '?d=' + encoded;
  },

  /**
   * 从URL解析用户A的数据
   */
  parseFromURL() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (!encoded) return null;

    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      const data = JSON.parse(json);
      if (data.q) return data;
    } catch (e) {
      console.error('解析分享数据失败:', e);
    }
    return null;
  },

  async copyLink(url) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      return true;
    }
  }
};
