export const STAGES = [
  { id: 'bp', label: 'BP', gameflow: ['ChampSelect'] },
  { id: 'loading', label: '加载', gameflow: ['LoadingScreen'] },
  { id: 'lane', label: '对线', gameflow: ['InProgress'] },
  { id: 'mid', label: '中期', gameflow: ['InProgress'] },
  { id: 'late', label: '后期', gameflow: ['InProgress'] },
  { id: 'review', label: '复盘', gameflow: ['PreEndOfGame', 'EndOfGame', 'WaitingForStats'] }
]

export const PROFILES = [
  { id: 'new', label: '峡谷新手', caption: '单一步骤' },
  { id: 'returning', label: '回流玩家', caption: '版本修正' },
  { id: 'active', label: '活跃玩家', caption: '条件决策' },
  { id: 'expert', label: '高段玩家', caption: '数据辅助' }
]

export const CHAMPIONS = {
  ahri: {
    id: 'ahri', name: '阿狸', role: '中路', score: 92, difficulty: '中等',
    icon: '/assets/ahri.png', splash: '/assets/ahri-splash.jpg',
    tags: ['机动', '开团补充'],
    reason: '你近 20 局的阿狸最稳定，能补足阵容的中距离先手。',
    risk: '前期推线后需避免无视野过河。',
    objective: '资源前 45 秒完成推线与回城'
  },
  orianna: {
    id: 'orianna', name: '奥莉安娜', role: '中路', score: 86, difficulty: '中高',
    icon: '/assets/orianna.png', splash: '/assets/orianna-splash.jpg',
    tags: ['团战', '阵地'],
    reason: '与蔚的进场协同最好，能提高中期资源团的稳定性。',
    risk: '缺少位移，需要更严格地管理河道视野。',
    objective: '用线权换取首个资源区站位'
  },
  galio: {
    id: 'galio', name: '加里奥', role: '中路', score: 79, difficulty: '简单',
    icon: '/assets/galio.png', splash: '/assets/galio-splash.jpg',
    tags: ['支援', '前排'],
    reason: '执行难度最低，能补足保护和全图支援能力。',
    risk: '对线压制力有限，需要接受部分补刀交换。',
    objective: '先清线，再用大招支援边路'
  }
}

export const BP_DATA = {
  patch: '16.15.1 · 演示数据',
  candidates: Object.values(CHAMPIONS),
  bans: [
    { id: 'leblanc', name: '乐芙兰', icon: '/assets/leblanc.png', score: 88, reason: '高机动换血会放大你的压线风险。' },
    { id: 'naafiri', name: '纳亚菲利', icon: '/assets/naafiri.png', score: 77, reason: '中期边线压制会限制己方双 C 的发育空间。' },
    { id: 'kassadin', name: '卡萨丁', icon: '/assets/kassadin.png', score: 69, reason: '拖入后期后，己方后排保护压力明显上升。' }
  ],
  ally: [
    { name: '纳尔', role: '上路', icon: '/assets/gnar.png' },
    { name: '蔚', role: '打野', icon: '/assets/vi.png' },
    { name: '待选择', role: '中路', icon: null },
    { name: '金克丝', role: '下路', icon: '/assets/jinx.png' },
    { name: '诺提勒斯', role: '辅助', icon: '/assets/nautilus.png' }
  ],
  enemy: [
    { name: '奥恩', role: '上路', icon: '/assets/ornn.png' },
    { name: '李青', role: '打野', icon: '/assets/leesin.png' },
    { name: '维克托', role: '中路', icon: '/assets/viktor.png' },
    { name: '卡莎', role: '下路', icon: '/assets/kaisa.png' },
    { name: '洛', role: '辅助', icon: '/assets/rakan.png' }
  ],
  composition: [
    { label: '开团', value: 88, tone: 'teal' },
    { label: '前排', value: 74, tone: 'gold' },
    { label: '持续输出', value: 81, tone: 'blue' },
    { label: '边线', value: 58, tone: 'red' }
  ],
  powerCurve: [
    { label: '前期', ally: 54, enemy: 61 },
    { label: '中期', ally: 78, enemy: 66 },
    { label: '后期', ally: 72, enemy: 82 }
  ],
  roleGap: '优先补充中距离先手，同时保留保护金克丝的能力。'
}

export const BUILDS = {
  ahri: {
    rune: '电刑', secondary: '巫术', spells: ['闪现', '传送'],
    firstBack: '遗失的章节 · 1200 金币',
    items: [
      { name: '卢登的伙伴', icon: '/assets/item-luden.png' },
      { name: '法师之靴', icon: '/assets/item-sorcs.png' },
      { name: '中娅沙漏', icon: '/assets/item-zhonya.png' }
    ],
    alternate: '敌方控制集中时，第二件切换女妖面纱。'
  },
  orianna: {
    rune: '召唤：艾黎', secondary: '启迪', spells: ['闪现', '传送'],
    firstBack: '遗失的章节 · 1200 金币',
    items: [
      { name: '卢登的伙伴', icon: '/assets/item-luden.png' },
      { name: '法师之靴', icon: '/assets/item-sorcs.png' },
      { name: '中娅沙漏', icon: '/assets/item-zhonya.png' }
    ],
    alternate: '对线压力低时，优先补高法强扩大团战收益。'
  },
  galio: {
    rune: '余震', secondary: '巫术', spells: ['闪现', '传送'],
    firstBack: '斑比的熔渣 · 900 金币',
    items: [
      { name: '日炎圣盾', icon: '/assets/item-radiant.png' },
      { name: '水银之靴', icon: '/assets/item-mercury.png' },
      { name: '中娅沙漏', icon: '/assets/item-zhonya.png' }
    ],
    alternate: '敌方物理伤害更高时，鞋子切换铁板靴。'
  }
}

export const PROFILE_COPY = {
  new: {
    loading: '先安全吃到三级，不要为了换血漏掉整波兵。',
    lane: { action: '先吃完这一波兵，再回城', reason: '下一波是炮车线，回城后兵线损失更少。' },
    mid: { action: '先清中线，再去小龙', reason: '清完线后再支援，经验和资源都不会断档。' },
    late: { action: '跟队友一起走，不要单独过河', reason: '后期一次阵亡会让对手直接拿下大龙。' }
  },
  returning: {
    loading: '当前版本第一件成型更晚，第一次回城优先补核心组件。',
    lane: { action: '这波先回城补组件，避免空装硬拼', reason: '当前构筑成型点后移，旧版本的换血阈值已经不适用。' },
    mid: { action: '先推中线，再回城接小龙', reason: '当前版本资源前站位更重要，提前 45 秒准备收益更稳定。' },
    late: { action: '远古龙前先处理下路线', reason: '超级兵线压力高于一次无视野站位收益。' }
  },
  active: {
    loading: '本局主目标：资源刷新前 45 秒推线回城，避免空装接团。',
    lane: { action: '河道无视野，先让兵线回推', reason: '敌方中野 18 秒未露头，为炮车继续压线的风险过高。' },
    mid: { action: '先推中线，再回城接小龙', reason: '小龙 45 秒刷新；现在回城可与队伍同步到河道。' },
    late: { action: '大龙前别单走，等辅助到位再过河', reason: '洛与李青均未露头，你的传送仍有 84 秒冷却。' }
  },
  expert: {
    loading: '中期 1.8 件套窗口己方团战收益最高；先锋团胜率模型为 57%。',
    lane: { action: '继续压线的收益与风险不对称', reason: '敌方中野消失 18 秒；放弃炮车预计损失 62 金币，被抓将延迟成装约 74 秒。' },
    mid: { action: '现在回城可提前 11 秒进入龙区', reason: '中线将在 23 秒后重置，TP 不可用，继续带线会错过第一轮视野交换。' },
    late: { action: '边线再带一波会延后 18 秒到大龙区', reason: 'TP 冷却 84 秒，敌方双人组消失，当前边线收益风险比为 0.64。' }
  }
}

export const GAME_DATA = {
  lane: {
    clock: '08:42', phaseLabel: '对线期', confidence: 86,
    stats: [
      { label: '补刀', value: '67', delta: '-6' },
      { label: '等级', value: '7', delta: '持平' },
      { label: '经济', value: '3,480', delta: '-210' },
      { label: '视野', value: '河道空缺', delta: '风险' }
    ],
    objectives: [
      { name: '小龙', time: '01:18', status: 'upcoming' },
      { name: '虚空巢虫', time: '00:36', status: 'upcoming' },
      { name: '闪现', time: '就绪', status: 'ready' }
    ],
    signals: [
      { time: '08:31', label: '敌方打野公开出现于下河道', tone: 'danger' },
      { time: '08:37', label: '下一波为炮车线', tone: 'neutral' },
      { time: '08:42', label: '玩家处于补刀状态，解释已抑制', tone: 'quiet' }
    ]
  },
  mid: {
    clock: '18:15', phaseLabel: '中期转线', confidence: 91,
    stats: [
      { label: '补刀', value: '151', delta: '+8' },
      { label: '等级', value: '12', delta: '+1' },
      { label: '经济', value: '7,920', delta: '+540' },
      { label: '中一塔', value: '34%', delta: '可推进' }
    ],
    objectives: [
      { name: '小龙', time: '00:45', status: 'upcoming' },
      { name: '大龙', time: '01:45', status: 'upcoming' },
      { name: '传送', time: '就绪', status: 'ready' }
    ],
    signals: [
      { time: '18:02', label: '敌方三人于下路公开露头', tone: 'safe' },
      { time: '18:08', label: '中路兵线已进入推进区间', tone: 'neutral' },
      { time: '18:15', label: '队友尚未进入龙区，已切换个人方案', tone: 'quiet' }
    ]
  },
  late: {
    clock: '31:40', phaseLabel: '后期决胜', confidence: 89,
    stats: [
      { label: '补刀', value: '258', delta: '+3' },
      { label: '等级', value: '17', delta: '持平' },
      { label: '经济', value: '14,860', delta: '+180' },
      { label: '下路线', value: '过河', delta: '需处理' }
    ],
    objectives: [
      { name: '大龙', time: '00:38', status: 'danger' },
      { name: '远古龙', time: '02:12', status: 'upcoming' },
      { name: '传送', time: '01:24', status: 'cooldown' }
    ],
    signals: [
      { time: '31:26', label: '敌方洛与李青离开己方视野', tone: 'danger' },
      { time: '31:33', label: '辅助正在从高地向河道移动', tone: 'neutral' },
      { time: '31:40', label: '单独过河风险高，建议等待 8 秒', tone: 'quiet' }
    ]
  }
}

export const REVIEW_DATA = {
  match: { result: '胜利', duration: '34:12', champion: '阿狸', score: '7 / 3 / 11', grade: 'A' },
  conclusion: '最值得改进的是资源刷新前的回城时机，而不是你的对线操作。',
  primaryGoal: '下一局在资源刷新前 45 秒完成推线与回城。',
  secondaryGoal: '进入无视野河道前等待辅助或补充远见视野。',
  metrics: [
    { label: '优势转化', value: '71%', delta: '+9%' },
    { label: '资源到场', value: '4 / 6', delta: '待提升' },
    { label: '无视野过河', value: '2 次', delta: '-1 次' },
    { label: '训练目标', value: '完成', delta: '连续 2 局' }
  ],
  curves: [
    { minute: 0, gold: 0, cs: 0, xp: 0 },
    { minute: 5, gold: -60, cs: -2, xp: 0 },
    { minute: 10, gold: -210, cs: -6, xp: -3 },
    { minute: 15, gold: 180, cs: 2, xp: 4 },
    { minute: 20, gold: 540, cs: 8, xp: 7 },
    { minute: 25, gold: 320, cs: 5, xp: 3 },
    { minute: 30, gold: 180, cs: 3, xp: 1 },
    { minute: 34, gold: 620, cs: 7, xp: 5 }
  ],
  decisions: [
    {
      id: 'd1', time: '10:18', title: '空装继续压线', impact: '中',
      visible: '河道无视野，敌方中野 18 秒未露头，身上 1,260 金币。',
      choice: '为炮车继续压线，被 Gank 后丢失两波兵。',
      alternative: '放弃炮车并从己方野区回城。',
      gain: '预计提前 74 秒完成首件装备。'
    },
    {
      id: 'd2', time: '18:00', title: '资源前边线停留过久', impact: '高',
      visible: '己方少一人，小龙 45 秒刷新，中线即将交汇。',
      choice: '继续处理边线，晚 13 秒进入龙区。',
      alternative: '推完当前线后立即回城，与队伍同步进河道。',
      gain: '获得第一轮视野站位，降低被迫接团的风险。'
    },
    {
      id: 'd3', time: '26:44', title: '击杀后完成优势转化', impact: '正向',
      visible: '敌方打野阵亡 31 秒，中路兵线已到塔前。',
      choice: '停止追击并转中一塔。',
      alternative: '当前选择正确。',
      gain: '获得中一塔并提前布置大龙视野。'
    }
  ]
}

export const initialState = {
  mode: 'mock',
  stage: 'bp',
  profile: 'active',
  selectedChampion: 'ahri',
  buildApplied: false,
  connectedAt: new Date().toISOString(),
  annotations: [
    { id: 'a1', time: '18:00', text: '这里应该提前回城，下一局重点练习。', createdAt: new Date().toISOString() }
  ]
}
