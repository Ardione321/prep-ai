import { IQuestion } from "@/backend/models/interview.model";
import { pageIcons } from "@/constants/page";

export function getPageIconAndPath(pathname: string): {
  icon: string;
  color: string;
} {
  return pageIcons[pathname];
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Display minutes:remainingSeconds
  return `${minutes?.toString().padStart(2, "0")}: ${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};
