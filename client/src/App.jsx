
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./Components/Auth/RequireAuth";
import "./App.css";

// Lazy-loaded components
const SignUp = lazy(() => import("./Pages/Auth/SignUp"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const CourseList = lazy(() => import("./Pages/Courses/CourseList"));
const CourseDescription = lazy(() =>
  import("./Pages/Courses/CourseDescription")
);
const CreateCourse = lazy(() => import("./Pages/Courses/CreateCourse"));
const AdminDashboard = lazy(() => import("./Pages/Dashboard/AdminDashboard"));
const AddLecture = lazy(() => import("./Pages/Lecture/AddLecture"));
const DisplayLectures = lazy(() => import("./Pages/Lecture/DisplayLectures"));
const ForgetPassword = lazy(() => import("./Pages/Password/ForgetPassword"));
const ResetPassword = lazy(() => import("./Pages/Password/ResetPassword"));
const ChangePassword = lazy(() => import("./Pages/Password/ChangePassword"));
const ManageTest = lazy(() => import("./Pages/Test/ManageTest"));
const AddMCQForm = lazy(() => import("./Pages/Test/AddMCQForm"));
const StartTest = lazy(() => import("./Pages/Test/startTest"));
const TestResult = lazy(() => import("./Pages/Test/TestResult"));
const Profile = lazy(() => import("./Pages/User/Profile"));
const EditProfile = lazy(() => import("./Pages/User/EditProfile"));

// Eager-loaded components
import HomePage from "./Pages/Static/HomePage";
import AboutUs from "./Pages/Static/AboutUs";
import Contact from "./Pages/Static/Contact";
import Denied from "./Pages/Auth/Denied";
import NotFoundPage from "./Pages/Static/NotFoundPage";

import Checkout from "./Pages/Payment/Checkout";
import CheckoutSuccess from "./Pages/Payment/CheckoutSuccess";
import CheckoutFailure from "./Pages/Payment/CheckoutFailure";

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <span className="loading loading-bars loading-md"></span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="course/description" element={<CourseDescription />} />

        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Requires authentication with the role "ADMIN" */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/course/addLecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/manageTest" element={<ManageTest />} />
          <Route path="/test/addMcqForm" element={<AddMCQForm />} />
        </Route>

        <Route path="/startTest" element={<StartTest />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFailure />} />
          <Route path="/course/displaylectures" element={<DisplayLectures />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/test/result" element={<TestResult />} />
        </Route>

        <Route path="/denied" element={<Denied />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
