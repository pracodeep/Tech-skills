
import React from "react";
import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaInfoCircle } from "react-icons/fa";
import { MdContacts, MdManageAccounts } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { FaSignInAlt } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { IoCreateSharp } from "react-icons/io5";

const HomeLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // checking if user is LoggedIn
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  // diplaying the options based on role
  const role = useSelector((state) => state?.auth?.role);

  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "0";
  }

  async function handleLogout(e) {
    e.preventDefault();
    const res = await dispatch(logout());
    if (res?.payload?.success) navigate("/");
  }

  return (
    <div className="min-h-[90vh] font-custom">
      <div className="drawer absolute left-0 z-50 w-fit">
        <input type="checkbox" className="drawer-toggle" id="my-drawer" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu
              onClick={changeWidth}
              size={"30px"}
              className="font-bold text-white ml-6 mt-6"
            />
          </label>
        </div>
        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 sm:w-52 h-[100%] bg-base-200 text-lg text-base-content relative">
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>
            {isLoggedIn && role === "ADMIN" && (
              <li className="text-sm">
                <Link to="/admin/dashboard">
                  <MdManageAccounts />
                  Admin DashBoard
                </Link>
              </li>
            )}
            <li>
              <Link to="/">
                <IoHome /> Home
              </Link>
            </li>

            <li>
              <Link to="/courses">
                <SiYoutubestudio />
                All Courses
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <MdContacts />
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about">
                <FaInfoCircle />
                About Us
              </Link>
            </li>
            {!isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="btn-primary font-semibold rounded-md w-full flex h-10 p-3 sm:text-sm items-center justify-center gap-2 sm:gap-1"
                  >
                    <FaSignInAlt />
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signUp")}
                    className="btn-secondary font-semibold rounded-md w-full flex h-10 p-3 sm:text-sm items-center justify-center gap-2"
                  >
                    <IoCreateSharp />
                    Signup
                  </button>
                </div>
              </li>
            )}
            {isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button
                    onClick={() => navigate("/user/profile")}
                    className="btn-primary font-semibold rounded-md w-full flex h-10 p-3 sm:text-sm items-center justify-center gap-2"
                  >
                    <CgProfile />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary font-semibold rounded-md w-full flex h-10 p-3 sm:text-sm items-center justify-center gap-2"
                  >
                    <RiLogoutCircleFill />
                    Logout
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
