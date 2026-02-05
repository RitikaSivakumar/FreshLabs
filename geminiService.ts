import { GoogleGenAI } from "@google/genai";
import { ComplianceRecord, ComplianceStatus } from "./types";

/**
 * Initialize the Gemini AI client using the environment variable.
 * If API_KEY is missing, initialization is deferred to avoid crashes.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Insights will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getComplianceInsights = async (compliances: ComplianceRecord[]) => {
  const ai = getAIClient();
  if (!ai) {
    return ["AI Insights are currently unavailable: API Key not configured."];
  }

  const pending = compliances.filter(c => c.status !== ComplianceStatus.COMPLETED);
  const dataSummary = pending.map(p => ({
    name: p.name,
    due: p.dueDate,
    status: p.status,
    reason: p.delayReason || "Not provided"
  }));

  const prompt = `As a financial compliance risk analyst, review the following pending tax compliances and provide a high-level executive summary (3-4 bullet points) on potential risks, penalties, and prioritized action items.
  
  Data: ${JSON.stringify(dataSummary)}
  
  Format: Return a JSON object with a key "summary" which is an array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return ["No insights generated."];
    
    const result = JSON.parse(text);
    return result.summary || ["No specific risks identified at this moment."];
  } catch (error) {
    console.error("AI Insight Error:", error);
    return ["Unable to generate AI insights at this time. Please check your connection."];
  }
};