
import { GoogleGenAI, Type } from "@google/genai";
import { AdviceType, MedicationAIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMedication = async (medName: string, dosage: string, userAge: number): Promise<MedicationAIAnalysis> => {
  try {
    const prompt = `Analyze the medication "${medName}" (dosage: ${dosage}) for a patient who is ${userAge} years old.
    Provide safety instructions, food interaction advice, activities to avoid, and common side effects.
    Crucial: Consider the patient's age (${userAge}) when recommending activities to avoid (e.g., fall risk for elderly) or side effects.
    Be concise and practical for a patient reminder app.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            adviceType: {
              type: Type.STRING,
              enum: [
                AdviceType.BEFORE_MEAL,
                AdviceType.AFTER_MEAL,
                AdviceType.WITH_MEAL,
                AdviceType.NO_RESTRICTION
              ],
              description: "Best time to take regarding meals."
            },
            instructions: {
              type: Type.STRING,
              description: "Short instruction string (max 1 sentence), tailored to age."
            },
            activitiesToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of activities to avoid (e.g. driving, sunlight), considering age risks."
            },
            sideEffects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Top 3 common side effects."
            }
          },
          required: ["adviceType", "instructions", "activitiesToAvoid", "sideEffects"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MedicationAIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails or key is missing
    return {
      adviceType: AdviceType.NO_RESTRICTION,
      instructions: "Consult your doctor for specific instructions.",
      activitiesToAvoid: [],
      sideEffects: []
    };
  }
};
