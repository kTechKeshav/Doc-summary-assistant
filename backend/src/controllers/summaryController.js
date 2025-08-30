import fs from "fs";
import { getDocument } from "pdfjs-dist"; 
import Tesseract from "tesseract.js";
import { summarizeWithGemini } from "../services/geminiService.js";

async function extractTextFromPDF(buffer) {
  const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}

async function extractTextFromImage(buffer) {
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, "eng");
  return text;
}

export async function handleUpload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      text = await extractTextFromPDF(req.file.buffer);
    } else if (req.file.mimetype.startsWith("image/")) {
      text = await extractTextFromImage(req.file.buffer);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!text.trim()) {
      return res.status(400).json({ error: "Could not extract text from file" });
    }

    const summary = await summarizeWithGemini(
      text,
      req.body.length || "medium"
    );

    res.json({
      summary,
      textPreview: text.slice(0, 1000),
      filename: req.file.originalname,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Processing error" });
  }
}

