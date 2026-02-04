
import { GoogleGenAI } from "@google/genai";
import { ComplianceRecord, ComplianceStatus } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getComplianceInsights = async (compliances: ComplianceRecord[]) => {
  const pending = compliances.filter(c => c.status !== ComplianceStatus.COMPLETED);
  const dataSummary = pending.map(p => ({
    name: p.name,
    due: p.dueDate,
    status: p.status,
    reason: p.delayReason || "Not provided"
  }));

  const prompt = `As a financial compliance risk analyst, review the following pending tax compliances and provide a high-level executive summary (3-4 bullet points) on potential risks, penalties, and prioritized action items.
  
  Data: ${JSON.stringify(dataSummary)}
  
  Format: JSON with a key "summary" as an array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{"summary": []}');
    return result.summary;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return ["Unable to generate AI insights at this time. Please check your connection."];
  }
};
