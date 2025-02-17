import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateQuestionsGemini = async (
  industry: string,
  topic: string,
  type: string,
  role: string,
  numOfQuestions: number,
  duration: number,
  difficulty: string
): Promise<{ question: string }[]> => {
  const prompt = `
    Generate a total of "${numOfQuestions}" "${difficulty}" "${type}" interview questions for the topic "${topic}" in the "${industry}"
    industry. The interview is for a candidate applying for the role of "${role}" with a total duration of "${duration}" minutes.

    **Ensure the following:**
    - The questions are well-balanced, including both open-ended and specific questions.
    - Each question evaluates a specific skill or knowledge area relevant to the role.
    - The questions are clear, concise, and engaging for the candidate.
    - The questions are suitable for a "${difficulty}" interview in the "${industry}" industry.
    - Ensure the questions align with "${difficulty}" responsibilities and expertise in "${role}".

    **Instructions:**
    - Always follow the same format for questions.
    - Provide all questions without any prefix.
    - No question numbers, bullet points, or hyphens are required.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error("Failed to generate questions");
    }

    const questions = content
      .trim()
      .split("\n")
      .filter((q) => q)
      .map((q) => ({
        question: q,
      }));
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const evaluateAnswer = async (): Promise<void> => {
  // Implement evaluation logic using Gemini
};
