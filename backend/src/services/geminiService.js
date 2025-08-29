// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ use API key

// const run = async () => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const result = await model.generateContent("Say hello from Gemini!");
//   console.log(result.response.text());
// };

// run().catch(console.error);
// Helper to build summary prompt
function buildPrompt(text, length = "medium") {
  const lengthMap = {
    short: "Summarize in 30-60 words, highlight only the core points.",
    medium: "Summarize in 100-150 words, include main points and key details.",
    long: "Summarize in 300-400 words, preserving structure and major arguments."
  };
  return `${lengthMap[length]}\n\nDocument:\n${text}`;
}

export async function summarizeWithGemini(text, length = "medium") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ current model

    const prompt = buildPrompt(text, length);
    const result = await model.generateContent(prompt);

    // SDK v1.0+
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    throw err;
  }
}
