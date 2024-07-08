
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../Redux/Slices/AuthSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const { resetToken } = useParams();

  async function onFormSubmit(e) {
    e.preventDefault();

    if (!password) {
      toast.error("Please Enter password");
      return;
    }

    const response = await dispatch(resetPassword({ resetToken, password }));
    if (response?.payload?.success) {
      setPassword("");
      navigate("/");
    }
  }
  return (
    <div className="flex flex-col gap-10 items-center justify-center py-8 px-3 min-h-[100vh]">
      <div className=" shadow-[0_0_10px_black] px-5 pt-3 flex justify-center flex-col items-center gap-4">
        <h1 className="text-center text-4xl font-bold font-inter">
          Reset Password Page
        </h1>
        <form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col items-center gap-8 rounded-lg py-7 px-3 w-96 shadow-custom"
        >
          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="text-xl font-bold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your new password ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent px-3 outline-none focus:border-yellow-100 py-2 border w-96"
            />
          </div>
          <div className="w-full flex flex-col items-center gap-4">
            <button
              type="submit"
              className="rounded-md hover:bg-yellow-600  bg-yellow-500 text-white text-xl py-2 w-full"
            >
              set password
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

export default ResetPassword;
