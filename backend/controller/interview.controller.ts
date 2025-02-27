import dbConnect from "../config/dbConnect";
import { evaluateAnswer, generateQuestionsGemini } from "../gemini/gemini";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import Interview, { IQuestion } from "../models/interview.model";
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

export const updateInterviewDetails = catchAsyncErrors(
  async (
    interviewId: string,
    durationLeft: string,
    questionId: string,
    answer: string,
    completed?: boolean
  ): Promise<{ updated: true }> => {
    await dbConnect();

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    if (answer) {
      const questionIndex = interview?.questions?.findIndex(
        (question: IQuestion) => question._id.toString() === questionId
      );

      if (questionIndex === -1) {
        throw new Error("Question not found");
      }

      const question = interview?.questions[questionIndex];

      let overallScore = 0;
      let clarity = 0;
      let relevance = 0;
      let completeness = 0;
      let suggestion = "No suggestion provided";

      if (answer !== "pass") {
        ({ overallScore, clarity, relevance, completeness, suggestion } =
          await evaluateAnswer(question.question, answer));
      }

      if (!question?.completed) {
        interview.answered++;
      }

      question.answer = answer;
      question.completed = true;
      question.result = {
        overallScore,
        clarity,
        relevance,
        completeness,
        suggestion,
      };
      interview.durationLeft = Number(durationLeft);
    }

    if (interview?.answered === interview?.questions?.length) {
      interview.status = "completed";
    }

    if (durationLeft === "0") {
      interview.status = "completed";
      interview.durationLeft = Number(durationLeft);
    }

    if (completed) {
      interview.status = "completed";
    }

    await interview.save();

    return { updated: true };
  }
);
