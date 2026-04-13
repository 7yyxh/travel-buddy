/**
 * questions.js - 题库数据定义
 */
const Dimensions = {
  sleep:      { name: '作息习惯', tag: '早起鸟 ↔ 夜猫子', type: 'similar' },
  spending:   { name: '消费观念', tag: '背包客 ↔ 奢华游', type: 'similar' },
  pace:       { name: '旅行节奏', tag: '慢悠悠 ↔ 特种兵', type: 'similar' },
  food:       { name: '饮食偏好', tag: '猎奇型 ↔ 固定型', type: 'similar' },
  social:     { name: '性格社交', tag: '内向型 ↔ 外向型', type: 'complement' },
  planning:   { name: '规划倾向', tag: '计划型 ↔ 随性型', type: 'complement' },
  photo:      { name: '拍照习惯', tag: '摄影狂魔 ↔ 随手指拍', type: 'similar' },
  adapt:      { name: '应变能力', tag: '灵活型 ↔ 规律型', type: 'complement' }
};

const Questions = {
  all: [
    // ===== 维度1: 作息习惯 =====
    {
      id: '1-1',
      dimension: 'sleep',
      text: '旅行起床你怎么安排？',
      options: [
        { label: '6点准时起，赖床=亏了', score: 1 },
        { label: '7-8点自然醒就好', score: 2 },
        { label: '睡到几点算几点', score: 3 },
        { label: '中午前出门就算胜利', score: 4 }
      ]
    },
    {
      id: '1-2',
      dimension: 'sleep',
      text: '晚上十一点半后你在干嘛？',
      options: [
        { label: '已经躺平，明天要早起', score: 1 },
        { label: '修图发朋友圈，准备睡了', score: 2 },
        { label: '出门逛夜市，还没玩够', score: 3 },
        { label: '这才刚开始，夜生活走起', score: 4 }
      ]
    },

    // ===== 维度2: 消费观念 =====
    {
      id: '2-1',
      dimension: 'spending',
      text: '住宿你倾向选哪种？',
      options: [
        { label: '青旅民宿，省钱还能交朋友', score: 1 },
        { label: '干净舒适的快捷酒店就行', score: 2 },
        { label: '至少精品酒店，住得舒服很重要', score: 3 },
        { label: '要么不住，住就住好的', score: 4 }
      ]
    },
    {
      id: '2-2',
      dimension: 'spending',
      text: '旅行中一顿饭你愿意花多少？',
      options: [
        { label: '泡面搞定，省钱吃景点', score: 1 },
        { label: '找本地平价美食，人均五六十', score: 2 },
        { label: '好好吃一顿，一两百也行', score: 3 },
        { label: '必须豪华，旅游就要享受', score: 4 }
      ]
    },
    {
      id: '2-4',
      dimension: 'spending',
      text: '旅途中想体验一个付费项目？',
      options: [
        { label: '先看看有没有免费平替', score: 1 },
        { label: '价格合理就体验', score: 2 },
        { label: '来都来了，试一下', score: 3 },
        { label: '钱能再赚，体验不能重来', score: 4 }
      ]
    },

    // ===== 维度3: 旅行节奏 =====
    {
      id: '3-2',
      dimension: 'pace',
      text: '到一个景点你一般待多久？',
      options: [
        { label: '慢慢逛，待够再说', score: 1 },
        { label: '1-2小时差不多', score: 2 },
        { label: '看完主要的就撤', score: 3 },
        { label: '特种兵式打卡就走', score: 4 }
      ]
    },
    {
      id: '3-3',
      dimension: 'pace',
      text: '旅行中你觉得最重要的是？',
      options: [
        { label: '放松最重要，走到哪算哪', score: 1 },
        { label: '有大致计划，但别太赶', score: 2 },
        { label: '行程排满，不浪费一天', score: 3 },
        { label: '早起晚归，全部打卡', score: 4 }
      ]
    },

    // ===== 维度4: 饮食偏好 =====
    {
      id: '4-1',
      dimension: 'food',
      text: '到一个新地方你最想吃什么？',
      options: [
        { label: '越local越爱，路边摊也行', score: 1 },
        { label: '当地特色菜，但得是正规店', score: 2 },
        { label: '找个评价好的店，稳妥为主', score: 3 },
        { label: '连锁品牌最安心，别踩雷', score: 4 }
      ]
    },
    {
      id: '4-5',
      dimension: 'food',
      text: '你愿意为了一顿美食排队吗？',
      options: [
        { label: '排两小时也值', score: 1 },
        { label: '半小时可以接受', score: 2 },
        { label: '不排队，找不用等的', score: 3 },
        { label: '随便吃点，别为吃耽误玩', score: 4 }
      ]
    },

    // ===== 维度5: 性格社交 =====
    {
      id: '5-1',
      dimension: 'social',
      text: '旅途中你更喜欢？',
      options: [
        { label: '一个人安静地逛', score: 1 },
        { label: '和一两个好友一起', score: 2 },
        { label: '热热闹闹一群人', score: 3 },
        { label: '走到哪交到哪，朋友越多越好', score: 4 }
      ]
    },
    {
      id: '5-3',
      dimension: 'social',
      text: '旅途迷路了你会？',
      options: [
        { label: '自己看地图研究', score: 1 },
        { label: '先自己找，不行再问人', score: 2 },
        { label: '直接问路人', score: 3 },
        { label: '问路的同时还能跟人聊上', score: 4 }
      ]
    },

    // ===== 维度6: 规划倾向 =====
    {
      id: '6-1',
      dimension: 'planning',
      text: '旅行前你会做攻略吗？',
      options: [
        { label: '详详细细，精确到小时', score: 1 },
        { label: '大致规划，留些弹性', score: 2 },
        { label: '看看热门景点就够了', score: 3 },
        { label: '攻略？到了再说', score: 4 }
      ]
    },
    {
      id: '6-3',
      dimension: 'planning',
      text: '旅行中计划临时泡汤了？',
      options: [
        { label: '马上启动备用方案', score: 1 },
        { label: '有点不爽但能调整', score: 2 },
        { label: '没事，换个地方玩', score: 3 },
        { label: '正好，本来也不想执行', score: 4 }
      ]
    },
    {
      id: '6-4',
      dimension: 'planning',
      text: '到了一个新城市你先？',
      options: [
        { label: '按攻略直奔第一站', score: 1 },
        { label: '先找住处放下行李', score: 2 },
        { label: '随便走走感受氛围', score: 3 },
        { label: '哪里人多往哪钻', score: 4 }
      ]
    },

    // ===== 维度7: 拍照习惯 =====
    {
      id: '7-3',
      dimension: 'photo',
      text: '拍完照你会立刻修图吗？',
      options: [
        { label: '现场就调滤镜发朋友圈', score: 1 },
        { label: '晚上回酒店修一修', score: 2 },
        { label: '回家再说，先玩', score: 3 },
        { label: '不修图，原图直出', score: 4 }
      ]
    },
    {
      id: '7-4',
      dimension: 'photo',
      text: '遇到美景你会为拍照花多久？',
      options: [
        { label: '等光线找角度，半小时起步', score: 1 },
        { label: '找个好位置拍几分钟', score: 2 },
        { label: '随手拍一下就走了', score: 3 },
        { label: '不拍照，眼睛看看就行', score: 4 }
      ]
    },
    {
      id: '7-6',
      dimension: 'photo',
      text: '你对旅行中自拍怎么看？',
      options: [
        { label: '必须自拍！到此一游仪式感', score: 1 },
        { label: '偶尔来几张，记录自己来过', score: 2 },
        { label: '拍风景就好，不太自拍', score: 3 },
        { label: '拒绝自拍，太尴尬了', score: 4 }
      ]
    },

    // ===== 维度8: 应变能力 =====
    {
      id: '8-1',
      dimension: 'adapt',
      text: '航班突然延误3小时？',
      options: [
        { label: '无所谓，正好逛逛机场', score: 1 },
        { label: '有点烦但能接受', score: 2 },
        { label: '赶紧想办法改签', score: 3 },
        { label: '心态崩了，行程全乱了', score: 4 }
      ]
    },
    {
      id: '8-3',
      dimension: 'adapt',
      text: '旅途中突然身体不舒服？',
      options: [
        { label: '找个药店搞定继续走', score: 1 },
        { label: '休息一下缓一缓', score: 2 },
        { label: '看看要不要去诊所', score: 3 },
        { label: '直接回酒店躺平，不敢动了', score: 4 }
      ]
    },
    {
      id: '8-4',
      dimension: 'adapt',
      text: '到了发现酒店没房间了？',
      options: [
        { label: '周边再找一家就是了', score: 1 },
        { label: '联系平台沟通解决', score: 2 },
        { label: '焦虑但开始搜替代方案', score: 3 },
        { label: '完全慌了，不知道咋办', score: 4 }
      ]
    }
  ],

  // 按维度获取题目
  getByDimension(dim) {
    return this.all.filter(q => q.dimension === dim);
  },

  // 获取所有维度 key
  getDimensionKeys() {
    return [...new Set(this.all.map(q => q.dimension))];
  }
};
