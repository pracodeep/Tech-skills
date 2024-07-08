import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  lectures: [],
  currentLecture: 0,
  watchHistory: null,
  progress: 0,
};

export const getCourseLectures = createAsyncThunk(
  "course/lecture/get",
  async (courseId) => {
    try {
      const response = axiosInstance.get(`/lectures/${courseId}`);
      // toast.promise(response, {
      //   loading: "Fetching Course Lecture",
      //   success: "Lectures fetched successfully",
      //   error: "Failed to load the lectures",
      // });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const addCourseLecture = createAsyncThunk(
  "/course/lecture/add",
  async (data) => {
    try {
      const formData = new FormData();
      formData.append("lecture", data.lecture);
      formData.append("material", data.material);
      formData.append("title", data.title);
      formData.append("description", data.description);

      const response = axiosInstance.post(
        `/lectures/addLecture/${data.courseId}`,
        formData
      );
      toast.promise(response, {
        loading: "Wait !! it will take some Time to process...",
        success: "Lecture Added successfully 😃",
        error: "Failed to add the Lecture 😔",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteCourseLecture = createAsyncThunk(
  "/course/lecture/delete",
  async (data) => {
    try {
      const response = axiosInstance.delete(
        `/lectures?courseId=${data.courseId}&lectureId=${data.lectureId}`
      );
      toast.promise(response, {
        loading: "deleting coures lecture",
        success: "Lecture deleted successfully",
        error: "Failed to delete the Lecture",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const markLecture = createAsyncThunk(
  "/user/mark/lecture",
  async (ids) => {
    try {
      const response = await axiosInstance.put(`/user/mark-lecture`, {
        courseId: ids[0],
        lectureId: ids[1],
      });
      toast.success("Lecture Marked");
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const unMarkLecture = createAsyncThunk(
  "/user/unMark/lecture",
  async (ids) => {
    try {
      const response = await axiosInstance.put(`/user/unmark-lecture`, {
        courseId: ids[0],
        lectureId: ids[1],
      });
      toast.success("Lecture unMarked");
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getWatchHistory = createAsyncThunk(
  "/user/watchHistory",
  async () => {
    try {
      const res = await axiosInstance.get("/user/watchHistory");
      // toast.success(res?.data?.message);
      return res?.data;
    } catch (error) {
      toast.error(error?.message);
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {
    setCurrentLecture: (state, action) => {
      state.currentLecture = action.payload;
    },
    calculateProgress: (state, action) => {
      const courseId = action.payload;
      state.progress =
        (state?.watchHistory?.[courseId]?.length * 100) /
          state?.lectures?.length || 0;
    },
    clearOldLectures: (state, action) => {
      state.lectures = [];
      state.progress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.lectures = action?.payload?.course?.lectures;
      })
      .addCase(markLecture.fulfilled, (state, action) => {
        state.watchHistory = action.payload.data;
      })
      .addCase(unMarkLecture.fulfilled, (state, action) => {
        state.watchHistory = action.payload.data;
      })
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        state.watchHistory = action.payload.data;
      });
  },
});

export default lectureSlice.reducer;

export const { setCurrentLecture, calculateProgress, clearOldLectures } =
  lectureSlice.actions;