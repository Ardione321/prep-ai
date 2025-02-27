"use client";

import React, { useRef, useState } from "react";
import ResultStats from "./ResultStats";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview } from "@/backend/models/interview.model";
import QuestionCard from "./QuestionCard";

export default function ResultDetails({
  interview,
}: {
  interview: IInterview;
}) {
  return (
    <div>
      <div className="px-5">
        <ResultStats interview={interview} />

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-center my-5 gap-4">
            <div className="flex flex-wrap gap-4">
              <Chip
                color="primary"
                startContent={
                  <Icon icon="tabler:circle-check-filled" width={20} />
                }
                variant="faded"
              >
                {interview?.industry}
              </Chip>

              <Chip
                color="warning"
                startContent={
                  <Icon icon="tabler:circle-check-filled" width={20} />
                }
                variant="faded"
              >
                {interview?.type}
              </Chip>

              <Chip
                color="secondary"
                startContent={
                  <Icon icon="tabler:circle-check-filled" width={20} />
                }
                variant="faded"
              >
                {interview?.topic}
              </Chip>
            </div>
          </div>
          {interview?.questions.map((question, index) => (
            <QuestionCard key={index} index={index} question={question} />
          ))}

          <div className="flex justify-center items-center mt-10"></div>
        </div>
      </div>
    </div>
  );
}
