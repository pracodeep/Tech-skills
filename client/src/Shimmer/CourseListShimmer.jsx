
import React from "react";

const ShimmerCard = () => (
  <div className="w-[300px] h-[350px] animate-pulse bg-gray-400 shadow-lg rounded-lg p-3">
    <div className="flex flex-col gap-5">
      <div className="h-48 w-full p-2 rounded-lg animate-pulse bg-gray-700"></div>
      <div className="flex flex-col gap-3">
        <div className="h-5 animate-pulse  bg-gray-500"></div>
        <div className="h-5 animate-pulse  bg-gray-500"></div>
        <div className="h-5 animate-pulse  bg-gray-500"></div>
      </div>
    </div>
  </div>
);

export const ShimmerCards = () => {
  return (
    <>
      {new Array(8).fill(0).map((element, index) => {
        return <ShimmerCard key={index} />;
      })}
    </>
  );
};
