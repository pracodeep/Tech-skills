
import React from "react";
import UnlockTestDialog from "../Dialogbox/UnlockTestDialog";
import StartTestDialog from "../Dialogbox/StartTestDialog";
import { FaLock, FaUnlock } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TestButtons = () => {
  const navigate = useNavigate();

  const { role } = useSelector((state) => state?.auth);
  const { progress } = useSelector((state) => state?.lecture);

  return (
    <div>
      {role !== "ADMIN" && (
        <li className="flex items-center justify-center pt-4 sm:text-xs">
          {progress >= 80 ? (
            <>
              <button
                className="btn btn-accent sm:btn-sm sm:hidden"
                onClick={() => document.getElementById("testInfo").showModal()}
              >
                <FaUnlock /> Start Test
              </button>
              <button
                className="btn btn-accent sm:btn-sm hidden sm:block"
                onClick={() => navigate("/startTest")}
              >
                Start Test
              </button>
              <StartTestDialog />
            </>
          ) : (
            <>
              <button
                className="btn btn-success sm:btn-sm sm:hidden"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                <FaLock /> UnLock Test
              </button>
              <UnlockTestDialog />
            </>
          )}
        </li>
      )}
    </div>
  );
};

export default TestButtons;
