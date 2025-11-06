import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Recipe } from "../types";

export const generateRecipesWithGemini = async (
  ingredients: string[]
): Promise<Recipe[]> => {
  const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY as string,
  });

  const prompt = `You are a creative chef for the FreshiFy app. 
Given the following ingredients, generate 3 simple and delicious recipes.
Ingredients: ${ingredients.join(", ")}.
Please ensure the output is a valid JSON array.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              prepTime: { type: Type.STRING },
            },
            required: ["title", "ingredients", "instructions", "prepTime"],
          },
        },
      },
    });

    const jsonStr = response.text?.trim() ?? "[]";
    return JSON.parse(jsonStr) as Recipe[];
  } catch (error) {
    console.error("Gemini error:", error);
    return [
      {
        title: "Error Generating Recipes",
        ingredients: ["API failed"],
        instructions: ["Check your Gemini API key and try again."],
        prepTime: "N/A",
      },
    ];
  }
};
