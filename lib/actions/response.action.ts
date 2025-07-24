'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function generateComicCatImage() {
  const result = await generateText({
    model: google('gemini-2.0-flash-exp'),
    prompt: `Generate a high-quality cartoon-style image of a mischievous orange cat skateboarding down a city street. The cat should be wearing sunglasses and have a playful expression.`,
    providerOptions: {
      google: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    },
  });

  // Convert file(s) to data URL
  const images =
    result.files
      ?.filter(file => file.mimeType?.startsWith('image/'))
      .map(file => {
        // @ts-ignore
        const base64 = file.base64Data;
        const mime = file.mimeType;
        return {
          dataUrl: `data:${mime};base64,${base64}`,
          mimeType: mime,
        };
      }) ?? [];

  return {
    text: result.text,
    images,
  };
}
