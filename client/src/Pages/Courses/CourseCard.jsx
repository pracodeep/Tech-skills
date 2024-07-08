
import React from "react";
import { IoMdVideocam } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { setCurrentCourse } from "../../Redux/Slices/CourseSlice.js";
import { useDispatch } from "react-redux";

const CourseCard = ({ courseDetails }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleCourseCardClick() {
    dispatch(setCurrentCourse(courseDetails));
    navigate("/course/description");
  }

  return (
    <div
      onClick={handleCourseCardClick}
      className="text-white font-custom hover:scale-101  w-[300px] h-[350px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700  transition-all duration-500 ease-in-out"
    >
      <div className="overflow-hidden">
        <img
          className="h-48 w-full p-2 rounded-lg group-hover:scale=[1,2] transition-all ease-in-out diration-300 hover:scale-105"
          src={courseDetails?.thumbnail?.secure_url}
          alt="courses thumbnail"
        />
        <div className="p-4 space-y-1 text-white flex flex-col">
          <h2 className="text-xl font-bold text-yellow-500 line-clame-2">
            {courseDetails?.title}
          </h2>
          <p className="line-clame-2  text-sm text-grey-200">
            {courseDetails?.description &&
            courseDetails?.description?.length > 100
              ? `${courseDetails?.description?.slice(0, 56)}...`
              : courseDetails.description}
          </p>
          <hr className="bg-slate-400" />
          <div className="flex flex-col items-start justify-center gap-1">
            <p className="font-semibold text-base flex items-center gap-1">
              {/* <span className="text-yellow-500 font-bold">Instructor : </span> */}
              <GoPersonFill /> {courseDetails?.createdBy}
            </p>
            <p className="font-semibold flex items-center justify-center gap-1">
              <IoMdVideocam />
              <span className="text-yellow-500 font-bold">Lessons : {""}</span>
              {courseDetails?.numberOfLectures ||
                courseDetails?.lectures?.length ||
                0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
