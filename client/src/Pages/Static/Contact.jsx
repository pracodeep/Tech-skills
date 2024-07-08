
import React from "react";
import HomeLayout from "../../Layouts/HomeLayout.jsx";
import { useState } from "react";
import { isEmail } from "../../Utils/regxMatcher.js";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Utils/axiosInstance.js";

const Contact = () => {
  // State to manage user input for the contact form
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Function to update the state as user types into the form fields
  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  }

  // Function to handle form submission
  async function onFormSubmit(e) {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!userInput.name || !userInput.email || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }

    // Validation: Check if the email is valid
    if (!isEmail(userInput.email)) {
      toast.error("Invalid email");
      return;
    }

    try {
      // Send a POST request to the server with user input
      const response = axiosInstance.post("/contact", userInput);

      // Display a toast message while waiting for the response
      toast.promise(response, {
        loading: "Submitting your message...",
        success: "Form submitted successfully",
        error: "Failed to submit the form",
      });

      // Wait for the response and reset the form if successful
      const res = await response;
      if (res?.data?.message) {
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
  }
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh] w-full">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col items-center justify-center gap-2 p-5 md:p-3 sm:p-1 rounded-md text-white shadow-[0_0_10px_black] w-[20rem] md:w-[18rem]"
        >
          <h1 className="text-3xl md:text-xl sm:text-base font-semibold">
            Contact Form
          </h1>

          {/* Form fields for name, email, and message */}
          <div className="flex flex-col w-full gap-1">
            <label
              htmlFor="name"
              className="text-xl md:text-lg sm:text-base font-semibold"
            >
              Name
            </label>
            <input
              className="bg-transparent border px-2 py-1 rounded-sm outline-none"
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleInputChange}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label
              htmlFor="email"
              className="text-xl md:text-lg sm:text-base font-semibold"
            >
              Email
            </label>
            <input
              className="bg-transparent border px-2 py-1 rounded-sm outline-none"
              id="email"
              name="email"
              type="text"
              placeholder="Enter your email"
              onChange={handleInputChange}
              value={userInput.email}
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label
              htmlFor="message"
              className="text-xl md:text-lg sm:text-base font-semibold"
            >
              Message
            </label>
            <textarea
              className="bg-transparent border px-2 py-1 rounded-sm resize-none h-40 outline-none"
              id="message"
              name="message"
              type="text"
              placeholder="Enter your message"
              onChange={handleInputChange}
              value={userInput.message}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full md:btn-md sm:btn-sm bg-yellow-500 hover:bg-yello-500 transition-all ease-in-out duration-300 rounded-sm py-2 sm:py-1 font-semibold text-lg cursor-pointer"
          >
            submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Contact;
