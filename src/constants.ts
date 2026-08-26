import type { Category, Project, SignalType } from './types';

/** 類別 → 左側色條 / score 預設色 */
export const CAT_COLORS: Record<Category, string> = {
  edu: '#92700a',
  decision: '#1a7a4a',
  infra: '#5b3db8',
  data: '#c0392b',
  health: '#c05a10',
  tool: '#8a8778',
  other: '#8a8778',
};

/** 類別 → 顯示標籤 */
export const CAT_LABELS: Record<Category, string> = {
  edu: '教育',
  decision: '決策整合',
  infra: '基礎設施',
  data: '合成數據',
  health: '醫療',
  tool: '工具',
  other: '其他',
};

/** 類別 → tag 的 class */
export const TAG_CLASS: Record<Category, string> = {
  edu: 'tag-edu',
  decision: 'tag-legal',
  infra: 'tag-infra',
  data: 'tag-data',
  health: 'tag-health',
  tool: 'tag-tool',
  other: 'tag-tool',
};

/** 訊號軸 → 顯示 icon / 指標標籤 / 指標缺值時的 fallback 文案 */
export const SIGNAL_TYPE_META: Record<SignalType, { icon: string; metricLabel: string; blank: string }> = {
  funding: { icon: '💰', metricLabel: '融資', blank: '融資未知' },
  oss: { icon: '⭐', metricLabel: 'star/day', blank: 'star 未知' },
  product: { icon: '▲', metricLabel: 'upvotes', blank: 'upvote 未知' },
};

/** localStorage 鍵名 */
export const STORAGE_KEY = 'signal-lab.projects';

export const DEMO_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Synthesis',
    source: 'YC',
    category: 'edu',
    url: 'https://www.synthesis.com',
    desc: '針對兒童的 AI 自適應學習平台，起源於 SpaceX 員工子女學校。用遊戲化任務取代傳統課程，AI 動態調整難度和路徑。',
    notes: '已有大量付費用戶，Elon Musk 背景帶來早期曝光。課程生成速度是關鍵壁壘。',
    funding: '$22M Series A',
    signal: 5,
    aiScore: 91,
    relevance: ['2'],
    date: '2025-05',
  },
  {
    id: 2,
    name: 'Harvey AI',
    source: 'Crunchbase',
    category: 'decision',
    url: 'https://www.harvey.ai',
    desc: 'AI 原生法律服務平台。幫助律師快速搜索判例、起草文件、分析合約風險。不是讓律師打字更快，而是重新定義誰能用得起法律服務。',
    notes: '估值已到 $3B。核心護城河是法律數據庫的獨家訓練數據。中小律所是未被服務的長尾市場。',
    funding: '$3B Valuation',
    signal: 5,
    aiScore: 88,
    relevance: ['5'],
    date: '2025-04',
  },
  {
    id: 3,
    name: 'Gretel.ai',
    source: 'Crunchbase',
    category: 'data',
    url: 'https://gretel.ai',
    desc: '合成數據生成平台。幫助企業在不暴露真實用戶數據的情況下訓練 AI 模型。GDPR/HIPAA 合規驅動需求。',
    notes: 'B2B 模式，醫療和金融是主要客戶。數據隱私法規越嚴格，需求越大。',
    funding: '$52M Series B',
    signal: 4,
    aiScore: 72,
    relevance: [],
    date: '2025-03',
  },
  {
    id: 4,
    name: 'Khanmigo',
    source: 'Product Hunt',
    category: 'edu',
    url: 'https://www.khanacademy.org/khan-labs',
    desc: 'Khan Academy 推出的 AI 家教。用蘇格拉底式對話引導學生思考，而非直接給答案。支援數學、編程、人文科目。',
    notes: '非營利背景是雙面刃：公信力高但商業化慢。企業版和學區採購是主要營收來源。',
    funding: '$54M OpenAI Grant',
    signal: 4,
    aiScore: 79,
    relevance: ['2'],
    date: '2025-02',
  },
  {
    id: 5,
    name: 'Abridge',
    source: 'Crunchbase',
    category: 'health',
    url: 'https://www.abridge.com',
    desc: '醫療 AI：自動把醫生和病人的對話轉成結構化病歷摘要。讓醫生從文書中解放，專注診療。Epic 電子病歷系統深度整合。',
    notes: '典型的⑤信息整合場景：過去大量病歷數據 + 即時對話分析 → 最優文件輸出。醫院採購週期長是障礙。',
    funding: '$150M Series C',
    signal: 5,
    aiScore: 85,
    relevance: ['5'],
    date: '2025-05',
  },
  {
    id: 6,
    name: 'Learnosity',
    source: '其他',
    category: 'edu',
    url: 'https://learnosity.com',
    desc: 'B2B 評測內容 API。讓教育平台快速接入 AI 出題、批改、數據分析功能。不面向學生，面向教育科技公司。',
    notes: '基礎設施層邏輯，護城河強。但市場相對小眾，主要在英語市場。非英語市場有空白？',
    funding: '未公開',
    signal: 3,
    aiScore: 61,
    relevance: ['2'],
    date: '2025-01',
  },
];
