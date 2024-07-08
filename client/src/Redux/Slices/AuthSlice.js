
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Utils/axiosInstance.js";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data: JSON.parse(localStorage.getItem("data")) || {},
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  const loadingMessage = toast.loading("Please wait! Creating your account...");
  try {
    const res = await axiosInstance.post("/user/register", data);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.message, { id: loadingMessage });
    throw error;
  }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
  const loadingMessage = toast.loading(
    "Please wait! authntication in Progress..."
  );
  try {
    const res = await axiosInstance.post("/user/login", data);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.message, { id: loadingMessage });
    throw error;
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  const loadingMessage = toast.loading("Please wait! logout in Progress...");
  try {
    const res = await axiosInstance.get("/user/logout");
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.message, { id: loadingMessage });
    throw error;
  }
});

export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    const loadingMessage = toast.loading("wait! profile update in Progress...");
    try {
      const res = await axiosInstance.put(`/user/update/${data[0]}`, data[1]);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
      throw error;
    }
  }
);

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await axiosInstance.get("/user/me");
    return res?.data;
  } catch (error) {
    toast.error(error?.message);
  }
});

export const forgetPassword = createAsyncThunk(
  "/user/forget-password",
  async (email) => {
    const loadingMessage = toast.loading("Please wait! sending an email...");
    try {
      const res = await axiosInstance.post("/user/forgot-password", { email });
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/user/reset-password",
  async (data) => {
    const loadingMessage = toast.loading("reseting Password ...");
    try {
      const res = await axiosInstance.post(
        `/user/reset-password/${data.resetToken}`,
        {
          password: data.password,
        }
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
      throw error;
    }
  }
);

export const changePassword = createAsyncThunk(
  "/user/change-password",
  async (data) => {
    const loadingMessage = toast.loading("Changing Password ...");
    try {
      const res = await axiosInstance.post(`/user/change-password`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        state.isLoggedIn = true;
        state.role = action?.payload?.user?.role;
        state.data = action?.payload?.user;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.role = "";
        state.data = {};
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (!action?.payload?.user) return;
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
