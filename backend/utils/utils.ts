export const getQueryString = (
  searchParams: URLSearchParams
): { [key: string]: string } => {
  const queryString: { [key: string]: string } = {};

  searchParams?.forEach((value, key) => {
    queryString[key] = value;
  });

  return queryString;
};
