
import React from "react";
import { useNavigate } from "react-router-dom";

const StartTestDialog = () => {
  const navigate = useNavigate();

  return (
    <dialog id="testInfo" className="modal">
      <div className="modal-box p-6 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg mb-4">Test Rules</h3>
        <ul className="list-disc pl-4 mb-4">
          <li>Test contains 10 multiple-choice questions (MCQs).</li>
          <li>To receive a certificate, you must score 7 marks.</li>
          <li>You have to answer all questions to submit the test.</li>
          <li>Each question is worth 1 mark.</li>
          <li>Once submitted, you cannot change your answers.</li>
        </ul>
        <div className="flex justify-between">
          <button
            className="btn"
            onClick={() => document.getElementById("testInfo").close()}
          >
            Cancel
          </button>
          <button
            className="btn btn-wide btn-md sm:btn-sm"
            onClick={() => navigate("/startTest")}
          >
            Start Test
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default StartTestDialog;
