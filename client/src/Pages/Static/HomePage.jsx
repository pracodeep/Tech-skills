
import React from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { Link } from "react-router-dom";
import HomePageImage from "../../Assets/Images/homePageMainImage.png";

const HomePage = () => {
  return (
    <HomeLayout>
      <div className="pt-10 md:mt-25 w-full h-[90vh] md:h-full  text-white flex md:flex-col items-center justify-center gap-10 md:gap-5 mx-16 md:mx-4 sm:mx-1">
        <div className="w-1/2 md:w-full mt-10 flex flex-col gap-3 px-3">
          <h1 className="text-4xl md:text-2xl font-semibold">
            Find out Best
            <span className="text-yellow-500 font-bold"> online courses</span>
          </h1>
          <p className="text-xl md:text-base text-gray-200 break-words pr-3">
            We have a large library of courses taught by highly skilled and
            qualified faculties at a very affordable cost.
          </p>
          <div className="space-x-6 md:space-x-3 sm:space-x-1">
            <Link to="/courses">
              <button className="bg-yellow-500 px-5 py-3 lg:px-4 lg:py-2 rounded-md font-semibold text-lg lg:text-base cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                Explore courses
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-yellow-500 px-5 py-3 lg:px-4 lg:py-2 rounded-md font-semibold text-lg lg:text-base  cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 md:w-full flex items-center justify-center">
          <img
            alt="homepage image"
            src={HomePageImage}
            className="md:h-72 sm:h-52 sm:pb-4"
          />
        </div>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
