"use client";
import { evaluateUserAnswer } from "@/actions/interview.actions";
import { Button } from "@heroui/react";

const Results = () => {
  const handleClick = () => {
    evaluateUserAnswer();
  };
  return (
    <div>
      <Button onPress={handleClick}>Evaluate</Button>
    </div>
  );
};

export default Results;
