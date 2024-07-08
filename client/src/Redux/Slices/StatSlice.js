import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Utils/axiosInstance.js";

const initialState = {
  allUserCount: 0,
  subscribedUserCount: 0,
};

export const getStatsData = createAsyncThunk("stats/get", async () => {
  try {
    const response = axiosInstance.get("/admin/stats/users");
    toast.promise(response, {
      loading: "Fetching users stats",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to load the stats",
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const statSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      state.allUserCount = action?.payload?.allUserCount;
      state.subscribedUserCount = action?.payload?.subscribedUserCount;
    });
  },
});

export default statSlice.reducer;