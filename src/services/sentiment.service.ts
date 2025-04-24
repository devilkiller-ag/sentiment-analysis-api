import fetch from "node-fetch";

import { HFResponse, Sentiment } from "./../types/global.d.js";

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export const analyzeSentiment = async (text: string): Promise<Sentiment> => {
  if (!HF_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not defined");
  }

  const response = await fetch(HUGGINGFACE_API_URL, {
    body: JSON.stringify({ inputs: text }),
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sentiment analysis: ${response.statusText}`);
  }

  const data = (await response.json()) as HFResponse[];
  const label = data[0][0]?.label.toUpperCase();

  if (label.includes("POSITIVE")) return Sentiment.POSITIVE;
  if (label.includes("NEGATIVE")) return Sentiment.NEGATIVE;
  if (label.includes("NEUTRAL")) return Sentiment.NEUTRAL;

  return Sentiment.UNKNOWN;
};
