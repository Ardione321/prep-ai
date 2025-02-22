import ListInterviews from "@/components/interview/ListInteviews";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";

async function getInterviews() {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/interviews`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occured while fetching the data");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

const InterviewsPage = async () => {
  const data = await getInterviews();
  return <ListInterviews data={data} />;
};

export default InterviewsPage;
