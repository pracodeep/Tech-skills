
import React from "react";

const UnlockTestDialog = () => {
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Sorry</h3>
        <p className="py-4">To Unlock Test You Have To Complted 80%+ Course</p>
      </div>
    </dialog>
  );
};

export default UnlockTestDialog;
