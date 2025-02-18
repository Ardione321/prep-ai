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

function extractScoresAndSuggestion(content: string) {
  const overAllScoreMatch = content.match(/Overall score=(\d+)/);
  const relevanceScoreMatch = content.match(/Relevance score=(\d+)/);
  const clarityScoreMatch = content.match(/Clarity score=(\d+)/);
  const completenessScoreMatch = content.match(/Completeness score=(\d+)/);
  const suggestionsMatch = content.match(/Suggestions=(.*)/);

  const overAllScore = overAllScoreMatch ? overAllScoreMatch[1] : "0";
  const relevance = relevanceScoreMatch ? relevanceScoreMatch[1] : "0";
  const clarity = clarityScoreMatch ? clarityScoreMatch[1] : "0";
  const completeness = completenessScoreMatch ? completenessScoreMatch[1] : "0";
  const suggestion = suggestionsMatch ? suggestionsMatch[1] : "";

  return {
    overallScore: parseInt(overAllScore),
    relevance: parseInt(relevance),
    clarity: parseInt(clarity),
    completeness: parseInt(completeness),
    suggestion,
  };
}

export const evaluateAnswer = async (question: string, answer: string) => {
  // Implement evaluation logic using Gemini
  const prompt = `
  Evaluate the following answer to the question based on the evaluation criteria and provide the scores for relevance, clarity, and completeness, followed by suggestions in text format.
  
  **Evaluation Criteria:**
      1. Overall Score: Provide an overall score out of 10 based on the quality of the answer.
      2. Relevance: Provide a score out of 10 based on how relevant the answer is to the question.
      3. Clarity: Provide a score out of 10 based on how clear and easy to understand the explanation is.
      4. Completeness: Provide a score out of 10 based on how well the answer covers all aspects of the question.
      5. Suggestions: Provide any suggestions or improvements to the answer in text.

  **Question:** ${question}
  **Answer:** ${answer}

  **Instructions:**
      - Always follow same format for providing scores and suggestions.
      - Provide the score only like "Overall score=5", "Relevance score=7", "Clarity =9", "Completeness score=1", for following:
          - Overall score
          - Relevance score
          - Clarity score
          - Completeness score
      -Provide text only for following only like "Suggestions=your_answer_here":  
          - Suggestions or improved answer in text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error("Failed to evaluate answer");
    }

    const resultAnswer = extractScoresAndSuggestion(content);

    return {
      overallScore: resultAnswer.overallScore,
      relevance: resultAnswer.relevance,
      clarity: resultAnswer.clarity,
      completeness: resultAnswer.completeness,
      suggestion: resultAnswer.suggestion,
    };
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
