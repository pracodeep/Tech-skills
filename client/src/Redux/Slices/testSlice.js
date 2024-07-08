import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Utils/axiosInstance.js";

const initialState = {
  mcqs: [],
  currentMcqIndex: 0,
  selectedAnswers: {},
};

export const getCourseMcqs = createAsyncThunk(
  "course/mcqs/get",
  async (courseId) => {
    try {
      const response = axiosInstance.get(`/mcqs/getAllMcqs/${courseId}`);
      // toast.promise(response, {
      //   loading: "Fetching Course mcqs",
      //   success: "mcqs fetched successfully",
      //   error: "Failed to load the mcqs",
      // });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const addMcqInCourse = createAsyncThunk(
  "course/mcqs/add",
  async ({ courseId, mcqData }) => {
    try {
      const { question, options, correctOptionIndex } = mcqData;
      const response = axiosInstance.post(`/mcqs/addMcq/${courseId}`, {
        question,
        options,
        correctOptionIndex,
      });
      toast.promise(response, {
        loading: "Wait Adding MCQ",
        success: "mcqs Added successfully",
        error: "Failed to Add the MCQ",
      });
      return (await response)?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const editMcqInCourse = createAsyncThunk(
  "course/mcqs/edit",
  async ({ courseId, mcqData }) => {
    try {
      const { question, options, correctOptionIndex, MCQId } = mcqData;
      const response = axiosInstance.put(`/mcqs/editMcq/${courseId}/${MCQId}`, {
        question,
        options,
        correctOptionIndex,
      });
      toast.promise(response, {
        loading: "Wait updating MCQ",
        success: "mcqs updated successfully",
        error: "Failed to update the MCQ",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteMcq = createAsyncThunk("course/mcq/delete", async (ids) => {
  try {
    const response = axiosInstance.delete(
      `/mcqs/deleteMcq/${ids[0]}/${ids[1]}`
    );
    toast.promise(response, {
      loading: "deleting MCQ",
      success: "mcqs deleted successfully",
      error: "Failed to delete the mcq",
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const submitTest = createAsyncThunk(
  "course/submitTest",
  async ({ courseId, selectedAnswers }) => {
    try {
      const response = axiosInstance.post(`/mcqs/submitTest/${courseId}`, {
        selectedAnswers: selectedAnswers,
      });
      toast.promise(response, {
        loading: "submiting test",
        success: "test submit successfully",
        error: "Failed to submit the test",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    nextQue: (state, action) => {
      if (state.currentMcqIndex < state.mcqs.length) state.currentMcqIndex += 1;
    },
    prevQue: (state, action) => {
      if (state.currentMcqIndex > 0) state.currentMcqIndex -= 1;
    },
    selectAnswer: (state, action) => {
      const [mcqId, selectedOption] = action.payload;
      state.selectedAnswers[mcqId] = selectedOption;
    },
    clearOldTestData: (state, action) => {
      state.mcqs = [];
      state.currentMcqIndex = 0;
      state.selectedAnswers = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourseMcqs.fulfilled, (state, action) => {

        state.mcqs = action.payload.data;
      })
      .addCase(addMcqInCourse.fulfilled, (state, action) => {
        // state.mcqs = action.payload.data;
        if (action?.payload?.data) {
          state.mcqs.push(action.payload.data);
        } else {
          console.error("error while Pushing MCQ into state mcqs");
        }
      })
      .addCase(deleteMcq.fulfilled, (state, action) => {
        const id = action.payload.data;
        state.mcqs = state.mcqs.filter((mcq) => mcq._id !== id);
      })
      .addCase(editMcqInCourse.fulfilled, (state, action) => {
        const updatedMCQ = action.payload.data;
        const index = state.mcqs.findIndex((mcq) => mcq._id === updatedMCQ._id);

        if (index !== -1) {
          state.mcqs[index] = updatedMCQ;
        } else {
          console.error("MCQ not found in state");
        }
      });
  },
});

export const { nextQue, prevQue, selectAnswer, clearOldTestData } =
  testSlice.actions;

export default testSlice.reducer;