
import React from "react";
import RightHeader from "./RightHeader";
import LecturesList from "./LecturesList";
import TestButtons from "./TestButtons";

const RightPanel = () => {
  return (
    <ul className="lg:w-full lg:overflow-visible lg:shadow-sm lg:mt-4 basis-1/2 p-2 shadow-[0_0_10px_black] space-y-0 h-screen overflow-y-scroll">
      <RightHeader />
      <LecturesList />
      <TestButtons />
    </ul>
  );
};

export default RightPanel;
