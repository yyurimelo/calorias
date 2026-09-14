import { Router } from "express";
import { AnalyzeRequest } from "../models";
import { systemPrompt } from "../prompts/analyze.prompt";

const router = Router();

router.post("/analyze", async (req, res) => {
  const { image, prompt } = req.body as AnalyzeRequest;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  prompt ??
                  "Analise essa imagem e identifique os alimentos e estime suas calorias.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const result = await response.json();

  res.json(result);
});

export default router;