export type Category =
  | 'edu'
  | 'decision'
  | 'infra'
  | 'data'
  | 'health'
  | 'tool'
  | 'other';

export type FilterKey = 'all' | 'edu' | 'decision' | 'infra' | 'high';

export interface Project {
  id: number;
  name: string;
  source: string;
  category: Category;
  url: string | null;
  desc: string;
  notes: string;
  funding: string;
  signal: number; // 1–5
  aiScore: number | null;
  relevance: string[]; // 例如 ['2'] / ['5']
  date: string; // 'YYYY-MM'
}

/** 解析匯入後、尚未指派 id / date 的項目 */
export type ParsedProject = Omit<Project, 'id' | 'date'>;

/** 新增表單的欄位集合（送出前的原始輸入） */
export interface ProjectFormValues {
  name: string;
  source: string;
  category: Category;
  url: string;
  desc: string;
  notes: string;
  funding: string;
  signal: number;
}
