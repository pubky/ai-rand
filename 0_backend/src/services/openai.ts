import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const OPEN_AI_SDK_KEY = process.env.OPEN_AI_SDK_KEY;

export const openai = createOpenAI({
  apiKey: OPEN_AI_SDK_KEY,
  compatibility: "strict",
});

export const generatePostText = async ({ prompt, model = "gpt-3.5-turbo" }: { prompt: string; model?: string }): Promise<any> => {
  const { text } = await generateText({
    model: openai(model),
    prompt: `Write a tweet with a storytelling about:
    ${prompt}

    --
    Always answer in english.
    Try to open your sentence with different words than "Once upon a time" or "There was a time when" or "In a world where" or "In a time where" or "In a place where".
    Be creative!
    `,
  });

  return text;
};

export const generateImageFromText = async ({ prompt }: { prompt: string }) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPEN_AI_SDK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to generate image:", error);
  }
};

export default openai;
