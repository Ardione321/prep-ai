import { IQuestion } from "@/backend/models/interview.model";
import { pageIcons } from "@/constants/page";

export function getPageIconAndPath(pathname: string): {
  icon: string;
  color: string;
} {
  return pageIcons[pathname];
}

export const getFirstIncompleteQuestionIndex = (questions: IQuestion[]) => {
  const firstIncompleteIndex = questions.findIndex(
    (question) => !question?.completed
  );

  return firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
};
