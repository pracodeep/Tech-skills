
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgetPassword } from "../../Redux/Slices/AuthSlice";

const ForgetPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  async function onFormSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Please Enter Email");
      return;
    }

    const response = await dispatch(forgetPassword(email));
    if (response?.payload?.success) {
      setEmail("");
    }
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center py-8 px-3 min-h-[100vh]">
      <div className=" shadow-[0_0_10px_black] px-5 pt-3 flex justify-center flex-col items-center gap-4">
        <h1 className="text-center text-4xl font-bold font-inter">
          Forgot Password Page
        </h1>
        <form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col items-center gap-8 rounded-lg py-7 px-3 w-96 shadow-custom"
        >
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="text-xl font-bold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your registered Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent px-3 outline-none focus:border-yellow-100 py-2 border w-96"
            />
          </div>
          <div className="w-full flex flex-col items-center gap-4">
            <button
              type="submit"
              className="rounded-md hover:bg-yellow-600  bg-yellow-500 text-white text-xl py-2 w-full"
            >
              Sent Email
            </button>
            <p className="font-semibold text-base">
              Back to login{" "}
              <Link className="text-accent underline" to={"/login"}>
                login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
