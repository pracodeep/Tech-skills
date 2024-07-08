
import React, { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout.jsx";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { isEmail, isPassword } from "../../Utils/regxMatcher.js";
import { createAccount } from "../../Redux/Slices/AuthSlice.js";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");

  // State to store user registration data
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  // Function to handle user input changes
  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  }

  // Function to handle image upload
  function getImage(event) {
    event.preventDefault();
    // Getting the Image
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignUpData({ ...signUpData, avatar: uploadedImage });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  // Function to handle the creation of a new account
  async function createNewAccount(event) {
    event.preventDefault();

    // Validation checks for required fields
    if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
      toast.error("Please fill in all the details");
      return;
    }

    if (!signUpData.avatar) {
      toast.error("please Select Profile Picture");
      return;
    }

    // Checking name field length
    if (signUpData.fullName < 5) {
      toast.error("Name should be at least 5 characters");
      return;
    }

    // Checking valid email
    if (!isEmail(signUpData.email)) {
      toast.error("Invalid Email Id");
      return;
    }

    // Checking password validation
    if (!isPassword(signUpData.password)) {
      toast.error(
        "Password should be 6 - 16 characters long with at least a number and special character"
      );
      return;
    }

    // Creating FormData object for API request
    const formData = new FormData();
    formData.append("fullName", signUpData.fullName);
    formData.append("email", signUpData.email);
    formData.append("password", signUpData.password);
    formData.append("avatar", signUpData.avatar);

    // Dispatch create account action
    const response = await dispatch(createAccount(formData));

    // If the account creation is successful, navigate to the home page
    if (response?.payload?.success) {
      navigate("/");
    }

    // Resetting form data and preview image
    setSignUpData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });

    setPreviewImage("");
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-80 shadow-[0_0_0_5px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>
          <label htmlFor="image_uploads" className="cursor-pointer">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full m-auto"
                src={previewImage}
                alt="image"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            className="hidden"
            type="file"
            name="image_uploads"
            id="image_uploads"
            accept=".jpg, .jpeg, .png, .svg"
            onChange={getImage}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              required
              name="fullName"
              id="fullName"
              placeholder="Enter your Name..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signUpData.fullName}
            />
          </div>
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
              value={signUpData.email}
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
              value={signUpData.password}
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md py-2 font-semibold text-lg cursor-pointer mt-3"
          >
            create account
          </button>
          <div className="text-center">
            Already have an account ?{" "}
            <Link to="/login" className="text-accent link cursor-pointer">
              Login
            </Link>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default SignUp;
