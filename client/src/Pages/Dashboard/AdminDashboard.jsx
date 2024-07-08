
import React, { useEffect, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  getAllCourses,
  setCurrentCourse,
} from "../../Redux/Slices/CourseSlice";
import { getStatsData } from "../../Redux/Slices/StatSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { Bar, Pie } from "react-chartjs-2";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { BsCollectionPlayFill } from "react-icons/bs";
import { MdDelete, MdEditSquare } from "react-icons/md";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const myCourses = useSelector((state) => state?.course?.courseData);

  const { allUserCount, subscribedUserCount } = useSelector(
    (state) => state.stat
  );

  const { allPayments, monthlySalesRecord } = useSelector(
    (state) => state.razorpay
  );

  useEffect(() => {
    (async () => {
      await dispatch(getAllCourses());
      await dispatch(getStatsData());
      await dispatch(getPaymentRecord());
    })();
  }, []);

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    fontColor: "white",
    datasets: [
      {
        labels: "User Datails",
        data: [allUserCount, subscribedUserCount],
        backgroundColor: ["yellow", "green"],
        borderWidth: 1,
        borderColor: ["yellow", "green"],
      },
    ],
  };

  const salesData = {
    labels: [
      "Jan",
      "Fab",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: ["rgb(255,99,132)"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };

  async function onCourseDelete(id) {
    if (window.confirm("Are you sure you want to delete the course!!")) {
      const res = await dispatch(deleteCourse(id));

      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
        <h1 className="text-center text-5xl font-semibold text-yellow-500">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-2 gap-5 m-auto mx-10">
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="w-80 h-80">
              <Pie data={userData} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center ">
                  <p className="font-semibold">Registered Users</p>
                  <h3 className="text-4xl font-bold">{allUserCount}</h3>
                </div>
                <FaUsers className="text-yellow-500 text-5xl" />
              </div>
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center ">
                  <p className="font-semibold">Subscribed Users</p>
                  <h3 className="text-4xl font-bold">{subscribedUserCount}</h3>
                </div>
                <FaUsers className="text-green-500 text-5xl" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="h-80 w-full relative">
              <Bar className="absolute bottom-0 h-80 w-full" data={salesData} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center ">
                  <p className="font-semibold">Subscription Count</p>
                  <h3 className="text-4xl font-bold">
                    {allPayments?.count ? allPayments.count : 0}
                  </h3>
                </div>
                <FcSalesPerformance className="text-green-500 text-5xl" />
              </div>

              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center ">
                  <p className="font-semibold">Total Revenue</p>
                  <h3 className="text-4xl font-bold">
                    {allPayments?.count ? parseInt(allPayments.count) * 499 : 0}
                  </h3>
                </div>
                <GiMoneyStack className="text-green-500 text-5xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-center text-3xl font-semibold">
              courses overview
            </h1>
            <button
              onClick={() => {
                navigate("/course/create");
              }}
              className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 px-2 font-semibold text-lg cursor-pointer"
            >
              create new course
            </button>
          </div>
          <table className="table overflow-x-scroll">
            <thead>
              <tr>
                <th>S No</th>
                <th>Course Title</th>
                <th>Course Category</th>
                <th>Instuctor</th>
                <th>Total Lectures</th>
                <th className="text-center">Watch Lectures</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCourses?.map((course, idx) => {
                return (
                  <tr key={course?._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <p className="w-40 h-auto bg-transparent">
                        {course?.title}
                      </p>
                    </td>
                    <td>{course?.category}</td>
                    <td>{course?.createdBy}</td>
                    <td className="flex items-center justify-center">
                      {course?.numberOfLectures}
                    </td>

                    <td className="text-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
                        onClick={() => {
                          dispatch(setCurrentCourse(course));
                          navigate("/course/displaylectures");
                        }}
                      >
                        <BsCollectionPlayFill />
                      </button>
                    </td>
                    <td className="flex items-center justify-between">
                      <button
                        className="bg-blue-300 hover:bg-blue-400 transition-all ease-in-out duration-300 text-xl py-1 px-2 rounded-md font-bold"
                        onClick={() => {
                          navigate("/course/create", {
                            state: { ...course, id: course._id },
                          });
                        }}
                      >
                        <MdEditSquare />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 text-xl py-1 px-2 rounded-md font-bold"
                        onClick={() => {
                          onCourseDelete(course?._id);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AdminDashboard;
