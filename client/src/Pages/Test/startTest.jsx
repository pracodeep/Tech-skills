import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOldTestData,
  getCourseMcqs,
  nextQue,
  prevQue,
  selectAnswer,
  submitTest,
} from "../../Redux/Slices/testSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";

const StartTest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCourse } = useSelector((state) => state.course);
  const { mcqs, currentMcqIndex, selectedAnswers } = useSelector(
    (state) => state.test
  );

  useEffect(() => {
    if (currentCourse) {
      dispatch(clearOldTestData());
      dispatch(getCourseMcqs(currentCourse._id));
    } else {
      navigate(-1);
    }
  }, []);

  const tickAnswer = (mcqId, index) => {
    dispatch(selectAnswer([mcqId, index]));
  };

  async function handleSubmitTest() {
    if (Object.keys(selectedAnswers).length !== mcqs.length) {
      return toast.error("Please select all MCQS");
    }

    const res = await dispatch(
      submitTest({
        courseId: currentCourse._id,
        selectedAnswers,
      })
    );

    if (res.payload.success) {
      const { obtainMarks, result, totalMarks } = res.payload;
      navigate("/test/result", {
        state: { obtainMarks, result, totalMarks, courseId: currentCourse._id },
      });
    }
  }

  return (
    <>
      {mcqs && mcqs.length === 0 ? (
        <div className="flex items-center  justify-center w-full h-screen">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col h-screen pt-10 font-custom">
          <div className="flex sm:flex-col sm:gap-2 w-full items-center justify-evenly">
            <div className="text-4xl text-center lg:text-xl md:text-sm font-bold text-gray-500 underlin">
              {currentCourse.title} (Test Runuing)
            </div>
            <div className="w-44 h-28 md:w-32 md:h-28 md:text-xs sm:mb-6 rounded-lg flex flex-col items-start pl-2 justify-center gap-1 font-semibold shadow-2x">
              <div>Totol MCQS: {mcqs.length}</div>
              <div>Marked MCQS: {Object.keys(selectedAnswers).length}</div>
              <div>
                UnMarked MCQS:{" "}
                {mcqs.length - Object.keys(selectedAnswers).length}
              </div>
            </div>
          </div>
          <div className="w-full font-custom px-10 md:px-5 sm:px-2 h-screen flex flex-col gap-5 items-center justify-center">
            <h1 className="text-2xl md:text-lg font-bold pb-3 border-b-2 p-3 text-gray-300">
              QUE {currentMcqIndex + 1} : {mcqs[currentMcqIndex]?.question}
            </h1>
            <div className="card lg:card-side bg-base-10 shadow-2xl border-2 border-gray-500 w-1/2 lg:w-full">
              <div className="card-body flex-col gap-5 items-center">
                {mcqs[currentMcqIndex]?.options.map((option, index) => (
                  <div
                    key={index}
                    className="w-full p-2 rounded-lg flex items-center bg-slate-800 gap-4 text-xl md:text-base text-center"
                  >
                    <input
                      type="radio"
                      className="w-5 h-5"
                      id={`option-${index}`}
                      name="option"
                      checked={
                        selectedAnswers[mcqs[currentMcqIndex]._id] === index
                      } // Check if this option is selected
                      onChange={() =>
                        tickAnswer(mcqs[currentMcqIndex]._id, index)
                      }
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
                <div className="flex items-center gap-10">
                  <button
                    className="btn md:btn-sm sm:btn-sm"
                    onClick={(e) => currentMcqIndex > 0 && dispatch(prevQue())}
                  >
                    <TbPlayerTrackPrevFilled />
                    Prev
                  </button>
                  {currentMcqIndex === mcqs.length - 1 ? (
                    <button
                      className="btn btn-success md:btn-sm sm:btn-sm"
                      onClick={(e) => handleSubmitTest()}
                    >
                      Submit Test
                    </button>
                  ) : (
                    <button
                      className="btn md:btn-sm sm:btn-sm"
                      onClick={(e) => dispatch(nextQue())}
                    >
                      Next
                      <TbPlayerTrackNextFilled />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StartTest;