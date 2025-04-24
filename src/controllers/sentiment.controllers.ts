import prisma from "#prisma/client.js";
import { analyzeSentiment } from "#services/sentiment.service.js";
import { Sentence } from "#types/global.js";
import { Request, Response } from "express";
import fetch from "node-fetch";

export const processSentiments = async (req: Request, res: Response): Promise<void> => {
  try {
    const unprocessed = (await prisma.sentence.findMany({
      where: { sentiment: null },
    })) as Sentence[];

    const updated = await Promise.all(
      unprocessed.map(async (sentence: Sentence) => {
        const sentiment = await analyzeSentiment(sentence.text);

        await prisma.sentence.update({
          where: { id: sentence.id },
          data: { sentiment },
        });

        if (sentence.webhook) {
          await fetch(sentence.webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: sentence.id,
              sentiment,
            }),
          });
        }

        return { ...sentence, sentiment };
      }),
    );

    const result = updated.map((sentence) => ({
      text: sentence.text,
      sentiment: sentence.sentiment,
    }));

    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process sentiments." });
  }
};
