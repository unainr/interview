"use server";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenAI({ apiKey });

export const getResponse = async (prompt: string) => {
	try {
		const response = await genAI.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `
You are a senior frontend engineer.

Generate a clean, production-ready React UI using Vite + TypeScript.
Use only Tailwind CSS v4 utility classes for styling.
Use modern component primitives from shadcn/ui (e.g., Button, Card, Badge).
Use icons from lucide-react where helpful.

Split the UI into multiple reusable files using this format:

// File: index.html
<code>

// File: main.tsx
<code>

// File: App.tsx
<code>

// File: index.css
<code>

// File: components/ComponentName.tsx
<code>

Return only raw text output in this format — no markdown, no code fences, no explanations.
Ensure all imports are included, no globals assumed.
All code must be compatible with Vite + React + TS in a Sandpack environment.

Prompt: ${prompt}

`

		});

		const text = response.text as any;
return {success:true, data:text}
		// save to database
	} catch (error: any) {
		return {
			success: false,
			error: error || "graph TD;\nA[Error generating diagram]",
		};
	}
};
