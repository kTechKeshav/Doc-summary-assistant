import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

function buildPrompt(text, length = "medium") {
  const lengthMap = {
  short: `Write a concise summary in **40–80 words**. 
          Focus only on the core idea and most critical facts. 
          Do not include fluff or repetition. 
          Highlight essential keywords (e.g., names, dates, numbers, statistics) by wrapping them in <span> tags.`,

  medium: `Write a detailed summary in **120–170 words**. 
           Cover the main arguments, supporting details, and outcomes. 
           Ensure clarity, logical flow, and readability. 
           Highlight important entities, concepts, and critical insights by wrapping them in <span> tags.`,

  long: `Write a comprehensive summary in **300–500 words**. 
         Preserve the original structure, major arguments, and important context. 
         Maintain readability with proper paragraphing. 
         Highlight the most important concepts, arguments, names, dates, and statistics by wrapping them in <span> tags. 
         Avoid redundancy and filler sentences.`
};

  return `${lengthMap[length]}\n\nDocument:\n${text}`;
}

export async function summarizeWithGemini(text, length = "medium") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const prompt = buildPrompt(text, length);
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}
