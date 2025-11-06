import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Recipe } from "../types";

/* ===========================================================
   🧠 GEMINI – Text & Recipe Generator
   =========================================================== */

export const generateRecipesWithGemini = async (ingredients: string[]): Promise<Recipe[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY as string });

  const prompt = `
    You are a creative chef for the FreshiFy app. 
    Given the following ingredients, generate 3 simple and delicious recipes.
    Ingredients: ${ingredients.join(", ")}.
    Output a valid JSON array of objects with:
    title, ingredients, instructions, and prepTime.
  `;

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

    const text = response.text?.trim() ?? "[]";
    return JSON.parse(text) as Recipe[];
  } catch (error) {
    console.error("Gemini recipe generation failed:", error);
    return [
      {
        title: "Error Generating Recipe",
        ingredients: ["Could not connect to Gemini."],
        instructions: ["Please verify API key and network connection."],
        prepTime: "N/A",
      },
    ];
  }
};

/* ===========================================================
   🎥 VEO – Video Generator from Image + Prompt
   =========================================================== */

// Convert File to Base64 string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
  });

// ✅ Proper export that fixes your error
export const generateVideoWithVeo = async (
  imageFile: File,
  prompt: string,
  aspectRatio: "16:9" | "9:16" = "16:9"
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY as string });
  const imageBytes = await fileToBase64(imageFile);

  try {
    let operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt,
      image: { imageBytes, mimeType: imageFile.type },
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio,
      },
    });

    // Poll until done
    while (!operation.done) {
      await new Promise((r) => setTimeout(r, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("No video URL found.");

    const response = await fetch(`${downloadLink}&key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`);
    if (!response.ok) {
      const body = await response.text();
      if (body.includes("Requested entity was not found")) {
        throw new Error("Requested entity was not found");
      }
      throw new Error(`Failed to fetch video data: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err: any) {
    console.error("Veo video generation failed:", err);
    throw err;
  }
};
