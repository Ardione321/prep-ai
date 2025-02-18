import { IQuestion } from "@/backend/models/interview.model";

export const getFirstIncompleteQuestionIndex = (questions: IQuestion[]) => {
  const firstIncompleteIndex = questions.findIndex(
    (question) => !question?.completed
  );

  return firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
};
