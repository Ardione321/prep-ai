"use server";

import {
  createInterview,
  deleteUserInterview,
  evaluteAnswer1,
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

export async function evaluateUserAnswer() {
  return await evaluteAnswer1();
}
