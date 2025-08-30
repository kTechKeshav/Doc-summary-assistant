import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

function buildPrompt(text, length = "medium") {
  const lengthMap = {
  short: `Summarize in 30-60 words. 
          Highlight the most important keywords, dates, numbers, and names by wrapping them in <span> tags.`,
  
  medium: `Summarize in 100-150 words. 
           Include main points and key details. 
           Highlight the important entities, facts, or critical insights with <span> tags.`,
  
  long: `Summarize in 300-400 words, preserving structure and major arguments. 
         Highlight the most important concepts, arguments, names, dates, and statistics with <span> tags.`
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
