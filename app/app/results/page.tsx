import ListResults from "@/components/result/ListResults";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";

async function getInterviews(searchParams: string) {
  try {
    const urlParams = new URLSearchParams(searchParams);
    const queryString = urlParams.toString();
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/interviews?${queryString}`,
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

const ResultsPage = async ({ searchParams }: { searchParams: string }) => {
  const searchParamsValue = await searchParams;
  const data = await getInterviews(searchParamsValue);
  return <ListResults data={data} />;
};

export default ResultsPage;
