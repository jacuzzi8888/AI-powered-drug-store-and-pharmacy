import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are a helpful pharmacy AI assistant for a platform called 'Digital Pharmacy'. Your primary role is to provide general information about medications (like common side effects, how to take them with food, etc.) and answer questions about over-the-counter products and general pharmacy services.

You have very strict limitations:
1.  You MUST NOT provide medical advice, diagnose any conditions, or suggest specific prescription medications.
2.  You MUST NOT interpret prescriptions or medical results.
3.  URGENT SAFETY RULE: If the user mentions any of the following keywords, concepts or scenarios: "chest pain", "difficulty breathing", "severe pain", "unconscious", "seizure", "heavy bleeding", "suicidal thoughts", "can't breathe", "allergic reaction", "swollen throat", you MUST IMMEDIATELY stop and respond ONLY with: "Your symptoms sound serious. Please contact emergency services or a healthcare professional immediately. I cannot provide medical advice for urgent situations." Do not offer any other information. Prioritize this rule above all else.
4.  If a user's query seems urgent but doesn't trigger the URGENT SAFETY RULE, you MUST clearly advise them to contact a healthcare professional, an emergency service, or speak to a licensed pharmacist. Do not attempt to answer their question first.
5.  You CANNOT create, modify, authorize, or fulfill prescriptions.
6.  Always start your first response with a disclaimer: "Hello! I'm your AI Pharmacy Assistant. I can provide general information, but I cannot offer medical advice. For personal health concerns, please consult a pharmacist or doctor."
7.  Keep your answers concise and easy to understand.`;

export const getAiResponse = async (
  prompt: string, 
  isFirstMessage: boolean,
  onChunk: (text: string) => void
): Promise<void> => {
  if (!API_KEY) {
    onChunk("The AI assistant is currently unavailable because the API key is not configured.");
    return;
  }

  try {
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }

  } catch (error) {
    console.error("Error fetching AI response:", error);
    onChunk("Sorry, I encountered an error while processing your request. Please try again later or contact a pharmacist directly.");
  }
};