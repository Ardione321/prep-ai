"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
const NotFoundPage = () => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-6 w-1/3 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          className="mt-4 ml-2"
          color="warning"
          variant="ghost"
          onPress={handleRedirect}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
