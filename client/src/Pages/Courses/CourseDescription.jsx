
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";

const CourseDescription = () => {
  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state.auth);
  const { currentCourse } = useSelector((state) => state.course);

  useEffect(() => {
    if (!currentCourse) {
      navigate("/courses");
    }
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 md:px-10 sm:px-2 flex flex-col items-center justify-center text-white font-custom">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-10 py-10 relative">
          <div className="space-y-5">
            <img
              className="w-full h-64"
              alt="thumbnail"
              src={currentCourse?.thumbnail?.secure_url}
            />

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-between text-xl">
                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Total lectures :{" "}
                  </span>
                  {currentCourse?.numberOfLectures}
                </p>

                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Instructor :{" "}
                  </span>
                  {currentCourse?.createdBy}
                </p>
              </div>

              {role === "ADMIN" || data?.subscription?.status === "active" ? (
                <button
                  onClick={() => navigate("/course/displaylectures")}
                  className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                >
                  Watch lectures
                </button>
              ) : (
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-2xl font-bold text-yellow-500 mb-5 text-center">
              {currentCourse?.title}
            </h1>

            <p className="text-yellow-500 text-lg">Course description: </p>
            <p className="text-xl lg:text-lg md:text-xs">
              {currentCourse?.description}
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default CourseDescription;
