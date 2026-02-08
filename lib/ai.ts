import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});