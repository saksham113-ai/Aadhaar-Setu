
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightResponse, AIStatsRecommendation, AadhaarRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates high-level administrative insights for the National Dashboard.
 */
export const getAIInsights = async (data: AadhaarRecord[]): Promise<AIInsightResponse> => {
  const summary = data.slice(0, 40).map(d => 
    `${d.district}(${d.state}): E:${d.enrolled}, U:${d.updates}, R:${d.rejected}`
  ).join('|');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `SYSTEM: You are the UIDAI National Data Strategy Engine.
    TASK: Analyze the provided regional dataset for operational inefficiencies and potential fraud patterns.
    DATA: ${summary}
    
    OUTPUT REQUIREMENTS:
    1. Identify 3 critical 'Risk Factors'.
    2. Provide 3 'Administrative Measures' specific to UIDAI digital goals.
    3. Provide a 'Summary' evaluation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
          administrativeMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["riskFactors", "administrativeMeasures", "summary"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("Analysis service error.");
  }
};

/**
 * Generates interpretation and localized policy recommendations based on calculated stats.
 */
export const getAIStatsRecommendation = async (data: AadhaarRecord[], localStats: any): Promise<AIStatsRecommendation> => {
  const prompt = `SYSTEM: UIDAI Statistical Intelligence Module.
  INPUT STATISTICS: 
  - Mean: ${localStats.mean}
  - Median: ${localStats.median}
  - Mode: ${localStats.mode}
  - Variance: ${localStats.variance}
  - Covariance (Enrolment vs Updates): ${localStats.covariance}
  
  CONTEXT: Analysis for ${data.length} data points in the selected region.
  
  TASK:
  - Interpret these statistical values in the context of Aadhaar operations.
  - Explain what the Variance and Covariance suggest about operational consistency and service demand.
  - Suggest 5 Strategic Administrative Measures.
  
  OUTPUT ONLY JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mean: { type: Type.NUMBER },
          median: { type: Type.NUMBER },
          mode: { type: Type.NUMBER },
          variance: { type: Type.NUMBER },
          covariance: { type: Type.NUMBER },
          analysis: { type: Type.STRING },
          measures: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["mean", "median", "mode", "variance", "covariance", "analysis", "measures"]
      },
      thinkingConfig: { thinkingBudget: 1000 }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("Statistical analysis link failed.");
  }
};
