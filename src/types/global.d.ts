export enum Sentiment {
  NEGATIVE = "NEGATIVE",
  NEUTRAL = "NEUTRAL",
  POSITIVE = "POSITIVE",
  UNKNOWN = "UNKNOWN",
}

export type HFResponse = {
  label: string;
  score: number;
}[];

export interface Sentence {
  id: number;
  sentiment?: string;
  text: string;
  webhook?: string;
}

export interface SentenceRequestBody {
  sentences: string[];
  webhook?: string;
}

export interface SentenceResponse {
  sentence: string;
  sentiment: string;
}
