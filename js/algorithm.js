/**
 * algorithm.js - 适配度计算算法
 */
const Algorithm = {
  /**
   * 计算完整适配度结果
   * @param {Object} answersA - 用户A的答案 { questionId: optionIndex }
   * @param {Object} answersB - 用户B的答案
   * @returns {Object} 完整结果
   */
  calculate(answersA, answersB) {
    const dimScores = {};
    const dimKeys = Questions.getDimensionKeys();

    // 计算每个维度的适配度
    dimKeys.forEach(dim => {
      const dimQuestions = Questions.getByDimension(dim);
      const scoresA = [];
      const scoresB = [];

      dimQuestions.forEach(q => {
        if (answersA[q.id] !== undefined && answersB[q.id] !== undefined) {
          scoresA.push(q.options[answersA[q.id]].score);
          scoresB.push(q.options[answersB[q.id]].score);
        }
      });

      if (scoresA.length === 0) return;

      const avgA = scoresA.reduce((a, b) => a + b, 0) / scoresA.length;
      const avgB = scoresB.reduce((a, b) => a + b, 0) / scoresB.length;
      const maxRange = 3; // score 范围 1-4，最大差3

      const dimType = Dimensions[dim].type;
      let compatibility;

      if (dimType === 'similar') {
        compatibility = this.similarScore(avgA, avgB, maxRange);
      } else {
        compatibility = this.complementScore(avgA, avgB, maxRange);
      }

      dimScores[dim] = Math.round(compatibility * 100);
    });

    // 总分 = 各维度等权平均
    const validScores = Object.values(dimScores);
    const totalScore = validScores.length > 0
      ? Math.max(0, Math.min(100, Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)))
      : 0;

    // 结果等级
    const tier = this.getTier(totalScore);

    return { totalScore, dimScores, tier };
  },

  /**
   * 相似型评分：越接近分越高
   */
  similarScore(avgA, avgB, maxRange) {
    const diff = Math.abs(avgA - avgB);
    return Math.max(0, Math.min(1, 1 - (diff / maxRange)));
  },

  /**
   * 互补型评分：适度差异最高分
   * 完全一样 = 0.70, 适度差异(~40%范围) = 1.0, 极端差异 = 0.40
   */
  complementScore(avgA, avgB, maxRange) {
    const diff = Math.abs(avgA - avgB);
    const normalizedDiff = diff / maxRange; // 0 ~ 1
    // 一样=94%, 小差异=100%峰值, 极端差异=35%
    const score = -1.5 * Math.pow(normalizedDiff - 0.2, 2) + 1.0;
    return Math.max(0.35, Math.min(1.0, score));
  },

  /**
   * 找出两人答差异较大的题目
   */
  findDifferences(answersA, answersB) {
    const diffs = [];

    Questions.all.forEach(q => {
      const aIdx = answersA[q.id];
      const bIdx = answersB[q.id];
      if (aIdx === undefined || bIdx === undefined) return;

      const scoreA = q.options[aIdx].score;
      const scoreB = q.options[bIdx].score;
      const diff = Math.abs(scoreA - scoreB);

      if (diff >= 2) {
        diffs.push({
          questionId: q.id,
          questionText: q.text,
          dimension: q.dimension,
          answerA: q.options[aIdx].label,
          answerB: q.options[bIdx].label,
          diffLevel: diff, // 2 or 3
          tip: this.getTip(q.dimension, scoreA, scoreB)
        });
      }
    });

    return diffs;
  },

  /**
   * 根据维度给出旅行建议
   */
  getTip(dimension, scoreA, scoreB) {
    const tips = {
      sleep: '一个人可以早起安排行程，另一个就多睡会儿，中午汇合',
      spending: '建议提前商量好每日预算，大额消费互相通报一下',
      pace: '可以分头行动半天，各按自己节奏，再汇合分享见闻',
      food: '轮流选择餐厅，今天听你的明天听TA的',
      social: '给彼此一些独处空间，不必24小时黏在一起',
      planning: '一人负责大方向规划，另一人负责随性探索惊喜',
      photo: '等拍照的那个时，另一个可以先逛逛附近',
      adapt: '遇到突发状况先深呼吸，灵活的那个带头调整方案'
    };
    return tips[dimension] || '互相理解包容，旅途更愉快';
  },

  /**
   * 根据总分获取结果等级
   */
  getTier(score) {
    const tiers = [
      { min: 95, max: 100, tag: '天作之合', color: '#1A202C', desc: '你俩简直是旅行界的灵魂伴侣，一个眼神就懂对方想干嘛，建议原地绑定终身旅伴关系' },
      { min: 80, max: 94,  tag: '默契拍档', color: '#2D3748', desc: '基本不用磨合就能愉快出行，偶尔小分歧也变成旅途中的笑料' },
      { min: 60, max: 79,  tag: '互补搭档', color: '#4A5568', desc: '差异反而成了互补，一个负责规划一个负责惊喜，搭起来意外和谐' },
      { min: 40, max: 59,  tag: '磨合伙伴', color: '#5A6778', desc: '需要提前对齐一下期待，但只要互相迁就，旅途还是能玩得开心的' },
      { min: 20, max: 39,  tag: '一言难尽', color: '#2D3748', desc: '说真的，你们可能需要来一次深度沟通，或者考虑报个团各玩各的' },
      { min: 0,  max: 19,  tag: '劝你三思', color: '#1A202C', desc: '要不还是各玩各的吧，回来再约饭聊各自的精彩旅程也挺好' }
    ];

    for (const t of tiers) {
      if (score >= t.min && score <= t.max) return t;
    }
    return tiers[tiers.length - 1];
  }
};
