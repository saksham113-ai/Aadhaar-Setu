
export interface AadhaarRecord {
  state: string;
  district: string;
  enrolled: number;
  updates: number;
  rejected: number;
  gender_m: number;
  gender_f: number;
  age_group: '0-18' | '19-45' | '46-60' | '60+';
  month: string;
}

export interface AIInsightResponse {
  riskFactors: string[];
  administrativeMeasures: string[];
  summary: string;
}

export interface AIStatsRecommendation {
  mean: number;
  median: number;
  mode: number;
  variance: number;
  covariance: number;
  analysis: string;
  measures: string[];
}

export type Page = 'login' | 'dashboard' | 'demographics' | 'upload';
