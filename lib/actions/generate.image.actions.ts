"use server"

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import axios from 'axios';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});


export const generateImage = async (prompt:string|any) => { 

    const result = await generateText({
  model: google('gemini-2.0-flash-exp'),
  providerOptions: {
    google: { responseModalities: ['TEXT', 'IMAGE'] },
  },
  prompt: prompt ,
});

// 3. Extract image file
  const imageFile = result.files?.find(file => file.mimeType?.startsWith('image/')) as string|any;
  if (!imageFile || !imageFile.base64Data) {
    throw new Error('No image returned from Gemini');
  }

  const base64 = imageFile.base64Data;
  const mime = imageFile.mimeType;

  // 4. Upload to ImageKit
  const uploadResponse = await imagekit.upload({
    file: `data:${mime};base64,${base64}`, // must be data URI
    fileName: `gemini-cat-${Date.now()}.png`,
    folder: '/gemini-images', // optional
  });
  // 5. Return uploaded image URL + optional Gemini text
  return {
    imageUrl: uploadResponse.url,
    promptText: result.text,
  };


 }
