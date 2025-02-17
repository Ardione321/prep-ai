"use server";

import {
  createInterview,
  deleteUserInterview,
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
