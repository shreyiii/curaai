import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, Advice } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    possibleConditions: {
      type: Type.ARRAY,
      description: "A list of potential, non-diagnostic conditions based on the symptoms. Keep descriptions brief.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the possible condition." },
          description: { type: Type.STRING, description: "A brief, simple description of the condition." }
        },
        required: ["name", "description"]
      }
    },
    ayurvedicSuggestions: {
      type: Type.ARRAY,
      description: "Suggestions for safe, Ayurvedic medicines or herbs. Must include a disclaimer to consult a doctor or qualified Ayurvedic practitioner.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the Ayurvedic medicine or herb (e.g., Tulsi, Ashwagandha)." },
          advice: { type: Type.STRING, description: "Advice on its use for the reported symptoms, including a strong disclaimer." }
        },
        required: ["name", "advice"]
      }
    },
    homeRemedies: {
      type: Type.ARRAY,
      description: "A list of safe home remedies.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the home remedy (e.g., Hydration, Rest)." },
          advice: { type: Type.STRING, description: "A brief explanation of how to apply the remedy." }
        },
        required: ["name", "advice"]
      }
    },
    lifestyleAdvice: {
      type: Type.ARRAY,
      description: "General lifestyle advice for wellness.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The category of lifestyle advice (e.g., Diet, Sleep)." },
          advice: { type: Type.STRING, description: "Specific lifestyle recommendations." }
        },
        required: ["name", "advice"]
      }
    },
    urgencyWarning: {
      type: Type.STRING,
      nullable: true,
      description: "A clear warning if symptoms are severe (e.g., chest pain, high fever) recommending immediate medical attention. If not severe, this should be null."
    }
  },
  required: ["possibleConditions", "ayurvedicSuggestions", "homeRemedies", "lifestyleAdvice", "urgencyWarning"]
};


export const getHealthAdvice = async (userInput: UserInput): Promise<Advice> => {
  const { age, gender, symptoms, duration, history } = userInput;

  const systemInstruction = `You are Cura Gennie, an AI Health Advisor. Your role is to analyze user-provided symptoms and offer general, non-prescriptive advice with a focus on Ayurvedic remedies.
  - You MUST NOT provide a medical diagnosis. Use phrases like "Possible conditions could include..."
  - You MUST prioritize safety. If any symptom sounds severe (e.g., chest pain, difficulty breathing, severe headache, high fever, unexplained weight loss, blood in stool), your top priority is to set the 'urgencyWarning' field with a strong recommendation to "See a doctor immediately" or "Visit the nearest emergency room".
  - Instead of conventional over-the-counter (OTC) medicines, provide suggestions for Ayurvedic medicines or herbs. All advice in this category must include a disclaimer: "Disclaimer: Always consult a doctor or a qualified Ayurvedic practitioner before taking any new medicine or herb."
  - Keep all advice concise, clear, and easy to understand for a non-medical audience.
  - Structure your response strictly according to the provided JSON schema.
  - If medical history is provided (e.g., 'diabetes', 'allergies'), factor that into your advice, especially for medication suggestions (e.g., 'be cautious with sugar-containing remedies if diabetic'). If no history is provided, ignore it.
  - Do not invent information. Base your advice on common, widely accepted health knowledge.`;

  const prompt = `
    Please analyze the following health information and provide advice with a focus on Ayurvedic remedies.

    - Age: ${age}
    - Gender: ${gender}
    - Symptoms: ${symptoms}
    - Duration of Symptoms: ${duration}
    - Relevant Medical History: ${history || 'None provided'}

    Generate a response in JSON format based on these details.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: Advice = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error fetching or parsing Gemini response:", error);
    throw new Error("Failed to get advice from AI. The model may be unable to process the request. Please try again with different symptoms.");
  }
};