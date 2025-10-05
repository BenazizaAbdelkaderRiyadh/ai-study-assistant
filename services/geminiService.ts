import { GoogleGenAI, Type } from "@google/genai";
import type { StudyAids } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const studyAidsSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, easy-to-read summary of the provided text, focusing on key concepts and definitions. Should be formatted as a single string, possibly with markdown for headings and lists.",
    },
    flashcards: {
      type: Type.ARRAY,
      description: "A list of flashcards derived from the text. Each flashcard should have a clear question and a direct, accurate answer.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The 'front' of the flashcard, containing a single, specific question.",
          },
          answer: {
            type: Type.STRING,
            description: "The 'back' of the flashcard, containing the concise answer to the question.",
          },
        },
        required: ["question", "answer"],
      },
    },
    quiz: {
      type: Type.ARRAY,
      description: "A multiple-choice quiz based on the text. Questions should test understanding of important information.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The multiple-choice question.",
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 strings representing the possible answers.",
            items: {
              type: Type.STRING,
            },
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer, which must exactly match one of the strings in the 'options' array.",
          },
        },
        required: ["question", "options", "correctAnswer"],
      },
    },
    nextSteps: {
        type: Type.ARRAY,
        description: "A list of 3-5 suggestions for further study based on the provided text. These can be related topics, concepts to review, or deeper questions to explore.",
        items: {
            type: Type.STRING,
        },
    },
  },
  required: ["summary", "flashcards", "quiz", "nextSteps"],
};


export const generateStudyAids = async (text: string): Promise<StudyAids> => {
  const prompt = `
    Based on the following text, generate a comprehensive set of study aids. The output must be a valid JSON object that conforms to the provided schema.

    The JSON object should have four top-level keys: "summary", "flashcards", "quiz", and "nextSteps".

    1.  "summary": Create a concise summary of the key points from the text. Use markdown for structure if helpful (e.g., headings, bullet points).
    2.  "flashcards": Generate an array of at least 10 flashcard objects. These should focus on **key terms, definitions, and specific facts**. The questions should be direct and suitable for quick recall.
    3.  "quiz": Generate an array of at least 10 multiple-choice quiz question objects. These should be slightly more complex than the flashcards, focusing on **conceptual understanding, application of knowledge, or interpreting information** from the text.
        **Crucially, you must ensure the following quality standards for each quiz question:**
        *   **Accuracy:** The 'correctAnswer' must be factually and unambiguously correct based *only* on the provided text. Do not invent information.
        *   **Clarity:** The question must be phrased clearly and directly, without ambiguity.
        *   **Plausible Distractors:** The incorrect options (distractors) should be plausible but clearly incorrect according to the text. Avoid options that are too similar to the correct answer or could be considered correct under some interpretation.
        *   **Uniqueness:** The 'correctAnswer' must be the single best and definitively correct option in the 'options' array.
    4.  "nextSteps": Based on the text, provide a list of 3-5 suggestions for further study. These could be related advanced topics, key concepts that the user should review, or deeper questions they could explore.

    Ensure the content for the flashcards and the quiz are different to provide a varied study experience.

    Text to process:
    ---
    ${text}
    ---
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: studyAidsSchema,
    },
  });

  const jsonResponse = response.text.trim();
  const parsed = JSON.parse(jsonResponse);

  if (!parsed.summary || !Array.isArray(parsed.flashcards) || !Array.isArray(parsed.quiz) || !Array.isArray(parsed.nextSteps)) {
    throw new Error("Invalid response structure from AI.");
  }
  
  return parsed as StudyAids;
};
