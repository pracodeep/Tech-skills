
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addMcqInCourse,
  editMcqInCourse,
} from "../../Redux/Slices/testSlice.js";
import toast from "react-hot-toast";

const AddMCQForm = ({ courseId, editMCQData }) => {
  const dispatch = useDispatch();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  useEffect(() => {
    if (editMCQData) {
      // If editMCQData is provided, set the form fields with its values
      setQuestion(editMCQData.question);
      setOptions(editMCQData.options);
      setCorrectOptionIndex(editMCQData.correctOptionIndex);
    }
  }, [editMCQData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || !options) {
      return toast.error("All fields are required");
    }

    const uniqueOptions = new Set(options.map((option) => option.trim()));
    if (uniqueOptions.size !== options.length) {
      return toast.error("All options Should be Unique");
    }

    let response;
    if (editMCQData) {
      response = await dispatch(
        editMcqInCourse({
          courseId: courseId,
          mcqData: {
            question,
            options,
            correctOptionIndex,
            MCQId: editMCQData._id,
          },
        })
      );
    } else {
      response = await dispatch(
        addMcqInCourse({
          courseId: courseId,
          mcqData: {
            question,
            options,
            correctOptionIndex,
          },
        })
      );
    }

    // Clear form fields on success
    if (response?.payload?.success) {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOptionIndex(0);
    }
  };

  return (
    // <div className="flex justify-center items-center h-full">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="w-full max-w-md bg-gray-400 rounded-lg px-6"
    //   >
    //     <div className="mb-6">
    //       <label className="block text-gray-700 text-sm font-bold mb-2">
    //         Question:
    //       </label>
    //       <input
    //         type="text"
    //         value={question}
    //         onChange={(e) => setQuestion(e.target.value)}
    //         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
    //         placeholder="Enter your question here"
    //       />
    //     </div>
    //     {options &&
    //       options.map((option, index) => (
    //         <div key={index} className="mb-4">
    //           <label className="block text-gray-700 text-sm font-bold mb-2">{`Option ${
    //             index + 1
    //           }:`}</label>
    //           <input
    //             type="text"
    //             value={option}
    //             onChange={(e) => {
    //               const newOptions = [...options];
    //               newOptions[index] = e.target.value;
    //               setOptions(newOptions);
    //             }}
    //             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
    //             placeholder={`Enter option ${index + 1} here`}
    //           />
    //         </div>
    //       ))}
    //     <div className="mb-6">
    //       <label className="block text-gray-700 text-sm font-bold mb-2">
    //         Correct Option:
    //       </label>
    //       <select
    //         value={correctOptionIndex}
    //         onChange={(e) => setCorrectOptionIndex(parseInt(e.target.value))}
    //         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
    //       >
    //         {options.map((option, index) => (
    //           <option key={index} value={index}>
    //             {`Option ${index + 1}`} {option}
    //           </option>
    //         ))}
    //       </select>
    //     </div>
    //     <div className="flex justify-center">
    //       <button
    //         type="submit"
    //         className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //       >
    //         {editMCQData ? "Edit MCQ" : "Add MCQ"}
    //       </button>
    //     </div>
    //   </form>
    // </div>

    <div className="flex items-center justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] w-96"
      >
        <h1 className="text-3xl font-semibold">MCQ Form</h1>

        <div className="flex flex-col w-full gap-1">
          <label className="text-xl font-semibold">Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-transparent border px-2 py-1 rounded-sm outline-none"
            placeholder="Enter your question here"
          />
        </div>

        {options &&
          options.map((option, index) => (
            <div key={index} className="flex flex-col w-full gap-1">
              <label className="text-xl font-semibold">{`Option ${
                index + 1
              }:`}</label>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="bg-transparent border px-2 py-1 rounded-sm outline-none"
                placeholder={`Enter option ${index + 1} here`}
              />
            </div>
          ))}

        <div className="flex flex-col w-full gap-1">
          <label className="text-xl font-semibold">Correct Option:</label>
          <select
            value={correctOptionIndex}
            onChange={(e) => setCorrectOptionIndex(parseInt(e.target.value))}
            className="bg-transparent border px-2 py-1 rounded-sm outline-none bg-white text-gray-700"
          >
            {options.map((option, index) => (
              <option key={index} value={index} className="text-gray-700">
                {`Option ${index + 1}`} {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
        >
          {editMCQData ? "Edit MCQ" : "Add MCQ"}
        </button>
      </form>
    </div>
  );
};

export default AddMCQForm;
