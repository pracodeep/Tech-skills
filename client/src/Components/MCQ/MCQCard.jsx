
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md"; // Importing delete and edit icons from React Icons
import { useDispatch } from "react-redux";
import { deleteMcq } from "../../Redux/Slices/testSlice.js";

const MCQCard = ({
  _id,
  question,
  options,
  correctOptionIndex,
  index,
  courseId,
  onEdit,
}) => {
  const dispatch = useDispatch();

  function handleUpdate() {
    onEdit({ _id, question, options, correctOptionIndex, courseId, index });
  }

  return (
    <div className="w-3/4 bg-white text-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center">
        <div className="w-full font-semibold text-lg">
          <span> {parseInt(index + 1)}.</span>
          <span>{question}</span>
        </div>
        <div className="flex">
          {/* Update Icon */}
          <MdEdit
            className="text-gray-500 cursor-pointer mr-2"
            onClick={() => handleUpdate()}
          />
          {/* Delete Icon */}
          <MdDelete
            className="text-red-500 cursor-pointer"
            onClick={() => dispatch(deleteMcq([courseId, _id]))}
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-col">
          {options.map((option, i) => (
            <span key={i} className="ml-2">
              {String.fromCharCode(65 + i)}. {option}
            </span>
          ))}
        </div>
      </div>
      <div className="text-gray-600">
        ANS: {String.fromCharCode(65 + correctOptionIndex)}.
        {options[correctOptionIndex]}
      </div>
    </div>
  );
};

export default MCQCard;
