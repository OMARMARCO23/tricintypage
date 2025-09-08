import { GoogleGenAI } from "@google/genai";
import { calculateUsage } from '../utils/calculations.js';

// Safely access the API key to avoid reference errors in browser environments.
const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

// Initialize the AI service only if the API key is available.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getEnergySavingAdvice(readings, language) {
  if (!ai) {
    console.error("API key not found, Gemini service not initialized.");
    // Fallback advice if API key is missing
    return "Switch to LED bulbs. They use up to 85% less energy and last much longer than traditional incandescent bulbs.";
  }

  // Create a summary of recent usage
  let usageSummary = "The user has not provided any consumption data yet.";
  if (readings.length > 2) {
    const recentReadings = readings.slice(-5);
    const usages = [];
    for (let i = 1; i < recentReadings.length; i++) {
        const usage = calculateUsage(recentReadings[i], recentReadings[i-1]);
        if (usage > 0) {
            usages.push(usage.toFixed(2));
        }
    }
    if (usages.length > 0) {
        usageSummary = `Their recent consumption between readings (in kWh) has been: ${usages.join(', ')}.`;
    }
  }

  const prompt = `You are an expert in energy conservation. A user of a home electricity tracking app is asking for advice. 
  
  Please provide a single, actionable, and concise energy-saving tip. The tip should be easy for a regular person to understand and implement.
  
  Keep the response to 1-3 sentences.
  
  Here is a summary of the user's recent consumption: ${usageSummary}
  
  Based on this, generate a helpful tip. If their usage is high, suggest ways to reduce it. If it's low, provide encouragement and a tip to maintain it. If there's no data, give a general but effective tip.
  
  IMPORTANT: Respond only with the tip itself, without any preamble like "Here is a tip:". The response should be in the ${language} language.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching advice from Gemini:", error);
    throw new Error("Failed to get advice from AI service.");
  }
}