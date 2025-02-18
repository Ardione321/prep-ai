"use server";

import {
  createInterview,
  deleteUserInterview,
  updateInterviewDetails,
} from "@/backend/controller/interview.controller";
import { InterviewBody } from "@/backend/types/interview.types";

export async function newInterview(body: InterviewBody) {
  const result = await createInterview(body);
  return result;
}

export async function deleleInterview(interviewId: string) {
  const result = await deleteUserInterview(interviewId);
  return result;
}

export async function updateInterview(
  interviewId: string,
  durationLeft: string,
  questionId: string,
  answer: string,
  completed?: boolean
) {
  const result = await updateInterviewDetails(
    interviewId,
    durationLeft,
    questionId,
    answer,
    completed
  );
  return result;
}
