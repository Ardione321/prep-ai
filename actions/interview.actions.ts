"use server";

import { createInterview } from "@/backend/controller/interview.controller";
import { InterviewBody } from "@/backend/types/interview.types";

export async function newInterview(body: InterviewBody) {
  const result = await createInterview(body);
  return result;
}
