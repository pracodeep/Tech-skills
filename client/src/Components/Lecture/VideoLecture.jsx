import React from "react";
import { useSelector } from "react-redux";

const VideoLecture = () => {
  const { lectures, currentLecture } = useSelector((state) => state?.lecture);

  return (
    <>
      <div className="w-full p-4 lg:p-0 lg:mb-5">
        <div className="space-y-5 w-full p-2 rounded-lg shadow-[0_0_10px_black]">
          <video
            src={lectures && lectures[currentLecture]?.lecture?.secure_url}
            className="object-fill rounded-tl-lg rounded-tr-lg w-full h-96 md:h-72"
            controls
            muted
            disablePictureInPicture
            controlsList="nodownload"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="pl-5 mt-5 flex flex-col gap-5 font-custom">
          <div className="text-2xl sm:text-base">
            {/* <span className="text-yellow-500 text-2xl">Title : </span> */}
            Lecture {currentLecture + 1} |{" "}
            {lectures && lectures[currentLecture]?.title}
          </div>
          <p className="flex gap-3 text-gray-400 lg:hidden">
            {/* <span className="text-yellow-500 line-clamp-4">Description :</span> */}
            <span> {lectures[currentLecture]?.description}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default VideoLecture;