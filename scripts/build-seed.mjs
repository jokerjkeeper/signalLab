// 一次性種子產生器：把舊備份 + 本批新標的合併成 data/projects.json
// 用法：node scripts/build-seed.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const backup = JSON.parse(
  readFileSync(new URL('../data/signal-lab-backup-2026-06-03.json', import.meta.url), 'utf8'),
);

// 2026-06 近兩週公開募資 / 新發表的特別 AI 新創（已交叉查證）
const NEW = [
  {
    id: 1780600000001,
    name: 'Flourish',
    source: 'TechTimes',
    category: 'infra',
    url: 'https://www.techtimes.com/articles/317921/20260606/jeff-bezos-bets-flourish-500-million-startup-trying-copy-brain-fix-ais-power-crisis.htm',
    desc: 'connectomics 仿腦低功耗 AI，目標把推理功耗壓到 20–50W（筆電等級）',
    notes: 'Bezos+Lux+GV 投資，IE 之父 Thomas Reardon 創辦，另闢仿腦架構解 AI 電力危機。官網未確認。',
    funding: '$500M 種子輪 / 估值 $2.5B',
    signal: 4,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000002,
    name: 'Generalist AI',
    source: 'The Robot Report',
    category: 'infra',
    url: 'https://www.therobotreport.com/generalist-raises-400m-to-scale-its-general-purpose-ai-models/',
    desc: '給所有機器人用的通用實體 AI 模型（GEN-1），用於工廠 / 倉庫 / 實驗室',
    notes: 'DeepMind / Boston Dynamics 團隊，Nvidia+Bezos 跟投，GEN-1 號稱 99% 可靠度。官網未確認。',
    funding: '$400M / 估值 $2B',
    signal: 4,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000003,
    name: 'NEURA Robotics',
    source: 'BusinessWire',
    category: 'infra',
    url: 'https://neura-robotics.com',
    desc: '全棧認知機器人平台 Neuraverse，機器人持續學習與協作',
    notes:
      '歐洲最大全棧人形機器人輪，Tether / Nvidia / Amazon 投資，訂單 pipeline 逾 $10 億。\n來源: https://www.businesswire.com/news/home/20260610204575/en/',
    funding: '最高 $1.4B Series C / 估值 $7B',
    signal: 4,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000004,
    name: 'Bland',
    source: 'Fortune',
    category: 'tool',
    url: 'https://bland.ai',
    desc: '受監管產業的企業級語音 AI agent（電話 / SMS / chat）',
    notes:
      '自研語音模型非套殼，250+ 企業客戶、年處理 1.75 億通電話。\n來源: https://fortune.com/2026/06/16/voice-ai-bland-50-million-after-being-rejected-by-180-investors/',
    funding: '$50M Series C / 累計破 $100M',
    signal: 4,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000005,
    name: 'Ent',
    source: 'SecurityWeek',
    category: 'tool',
    url: 'https://www.securityweek.com/endpoint-security-startup-ent-emerges-from-stealth-with-100-million-seed-round/',
    desc: '意圖感知端點防護，即時監控人類與 AI agent 的異常行為',
    notes: 'RiskIQ 創辦人 + 微軟 Security Copilot 團隊，已部署 Global 2000 金融 / 國防。官網未確認。',
    funding: '$100M 種子輪',
    signal: 3,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000006,
    name: 'Limitless Labs',
    source: 'Unite.AI',
    category: 'tool',
    url: 'https://www.unite.ai/limitless-labs-raises-20m-series-a-to-bring-agentic-ai-into-precision-manufacturing/',
    desc: '嵌入 CAD/CAM 的 CNC agentic AI，自動辨識加工特徵並生成刀路',
    notes: '已在 Blue Origin / Cadillac F1 / Sandvik 產線部署，CNC 編程時間省 50%。官網未確認。',
    funding: '$20M Series A / 累計 $27.3M',
    signal: 4,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000007,
    name: 'Probably',
    source: 'Tech Startups',
    category: 'infra',
    url: 'https://techstartups.com/2026/06/16/venture-capital-startup-funding-roundup-june-15-2026-2/',
    desc: 'LLM 輸出驗證中間層，攔截幻覺並附引用與稽核軌跡',
    notes: 'a16z 投資，切企業可靠性痛點。來源較少，建議再自行查證。官網未確認。',
    funding: '$9M 種子輪',
    signal: 3,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000008,
    name: 'Cyera',
    source: 'Intellizence',
    category: 'tool',
    url: 'https://intellizence.com/insights/startup-funding/the-weeks-5-biggest-funding-deals-ai-robotics-space-intelligence-cybersecurity-and-it-automation-dominated-the-week/',
    desc: '企業資料安全與 AI 治理平台',
    notes: 'AI 普及後資料治理成剛需，客戶明確；確切日期 / 輪次代號待官方確認。官網未確認。',
    funding: '約 $600M 後期輪 / 估值 $12B',
    signal: 3,
    aiScore: null,
    relevance: [],
    date: '2026-06',
  },
  {
    id: 1780600000009,
    name: 'AlphaSense',
    source: 'Crunchbase News',
    category: 'decision',
    url: 'https://www.alpha-sense.com',
    desc: 'AI 市場情報與工作流編排平台',
    notes:
      '龐大金融 / 企業客戶 + 專有內容資料，成熟有營收非套殼。\n來源: https://news.crunchbase.com/venture/biggest-funding-rounds-june-5-2026/',
    funding: '$350M growth round',
    signal: 3,
    aiScore: null,
    relevance: ['5'],
    date: '2026-06',
  },
];

// 依名稱去重（既有備份優先），新標的排在最前面
const existing = new Set(backup.map((p) => String(p.name).toLowerCase()));
const additions = NEW.filter((p) => !existing.has(p.name.toLowerCase()));
const merged = [...additions, ...backup];

const out = new URL('../data/projects.json', import.meta.url);
writeFileSync(out, JSON.stringify(merged, null, 2) + '\n', 'utf8');
console.log(`wrote ${merged.length} projects (${additions.length} new, ${backup.length} from backup)`);
