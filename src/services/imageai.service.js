import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import axios from "axios";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    extractedCode: { type: SchemaType.STRING, description: "The original code extracted from the image as accurately as possible." },
    language: { type: SchemaType.STRING, description: "The detected programming language." },
    errors: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of detected bugs, vulnerabilities, and logical errors."
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of improvements and architectural suggestions."
    },
    fixedCode: { type: SchemaType.STRING, description: "The clean, corrected, and optimized version of the code." }
  },
  required: ["extractedCode", "language", "errors", "suggestions", "fixedCode"],
};

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
  systemInstruction: "You are an elite software engineer and code reviewer. Your task is to extract code from an provided image securely and accurately, identify its programming language, find any logical or syntax errors, suggest best practices, and output a refactored and clean version of the code.",
});

export const analyzeImageWithGemini = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, "utf-8");
    const mimeType = response.headers['content-type'] || 'image/jpeg';

    const imageParts = [
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType
        }
      }
    ];

    const prompt = "Please thoroughly analyze the code inside this image.";
    const result = await model.generateContent([prompt, ...imageParts]);
    return await result.response.text();
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};
