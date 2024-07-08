
import React, { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { login } from "../../Redux/Slices/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to store user registration data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Function to handle user input changes
  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all the details");
      return;
    }

    const response = await dispatch(login(loginData));

    if (response?.payload?.success) {
      navigate("/");
    }

    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={onLogin}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-80 shadow-[0_0_0_5px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Login Page</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={loginData.password}
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md py-2 font-semibold text-lg cursor-pointer mt-3"
          >
            Login
          </button>
          <div className="text-center">
            create an new account ?{" "}
            <Link to="/signup" className="text-accent link cursor-pointer">
              Sign Up
            </Link>
          </div>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-accent link cursor-pointer"
            >
              Forgot Password
            </Link>
            ?
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Login;
