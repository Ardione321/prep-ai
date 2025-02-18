import dbConnect from "../config/dbConnect";
import { evaluateAnswer, generateQuestionsGemini } from "../gemini/gemini";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import Interview from "../models/interview.model";
// import { generateQuestions } from "../openai/openai";
import { InterviewBody } from "../types/interview.types";
import { getCurrentUser } from "../utils/auth";

const mockQuestions = (numOfQuestions: number) => {
  const questions = [];
  for (let i = 0; i < numOfQuestions; i++) {
    questions.push({
      question: `Mock questions ${i + 1}`,
      answer: `Mock answer ${i + 1}`,
    });
  }
  return questions;
};

export const createInterview = catchAsyncErrors(
  async (body: InterviewBody): Promise<{ created: true }> => {
    await dbConnect();

    const {
      industry,
      type,
      topic,
      numOfQuestions,
      difficulty,
      duration,
      user,
      role,
    } = body;

    const questions = await generateQuestionsGemini(
      industry,
      topic,
      type,
      role,
      numOfQuestions,
      duration,
      difficulty
    );

    // console.log(data);

    // const questions = mockQuestions(numOfQuestions);

    const newInterview = await Interview.create({
      industry,
      type,
      topic,
      numOfQuestions,
      difficulty,
      duration: duration * 60,
      durationLeft: duration * 60,
      user,
      role,
      questions,
    });

    return newInterview?._id
      ? { created: true }
      : (() => {
          throw new Error("Interview not created");
        })();
  }
);

export const getInterviews = catchAsyncErrors(async (request: Request) => {
  // const session = await getServerSession(authOptions);
  await dbConnect();
  const user = await getCurrentUser(request);
  const interviews = await Interview.find({ user: user?._id });

  return { interviews };
});

export const getInterviewById = catchAsyncErrors(async (id: string) => {
  await dbConnect();

  const interview = await Interview.findById(id);

  return { interview };
});

export const deleteUserInterview = catchAsyncErrors(
  async (interviewId: string): Promise<{ deleted: true }> => {
    await dbConnect();

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    await interview.deleteOne();
    return { deleted: true };
  }
);

export const evaluteAnswer1 = catchAsyncErrors(async () => {
  await evaluateAnswer(
    "Describe your understanding of JSX and how it differs from regular JavaScript.  Explain its benefits in building React components.",
    "JSX (JavaScript XML) is a syntax extension for JavaScript that allows developers to write UI components using a syntax similar to HTML. JSX makes it easier to define the structure of React components in a readable and declarative way"
  );
});
