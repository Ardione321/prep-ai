import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = async (
  industry: string,
  topic: string,
  type: string,
  role: string,
  numOfQuestions: number,
  duration: number,
  difficulty: string
) => {
  const tokensPerQuestion = 500;
  const maxTokens = tokensPerQuestion * numOfQuestions;

  const prompt = `
    Generate total "${numOfQuestions}" "${difficulty}" "${type}" interview questions for the topic "${topic}" in the "${industry}"
    industry. The interview is for the candidate applying for the role of "${role}" and total duration of interview "${duration}" minutes.

    **Ensure the following**
    - The questions are well-balanced, including both open-ended and specific questions.
    - Each question is designed to evaluate a specific skill or knowledge area relevant to the role.
    - The questions are clear, concise and engaging for the candidate.
    - The question are suitable for a "${difficulty}" interview in the "${industry} industry".
    - Ensure the questions are directly aligned with "${difficulty}" responsibilities and experties in "${role}"

     **Instructions:**
    - Always follow same format for questions.
    - Provide all question without any prefix.
    - No question number or bullet points or hypen - is required.
    `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are expert in generating questions tailored to specific roles, industries, experience levels and topic. You responses should be professional, concise and well-structured. ",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature: 0.8,
  });

  const content = response?.choices[0]?.message.content;

  if (!content) {
    throw new Error("Failed to generate questions");
  }

};

export const evaluateAnswer = async () => {};
