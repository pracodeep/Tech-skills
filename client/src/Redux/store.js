
import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/AuthSlice.js";
import courseSliceReducer from "./Slices/CourseSlice.js";
import razorpaySliceReducer from "./Slices/RazorpaySlice.js";
import lectureSliceReducer from "./Slices/LectureSlice.js";
import statSliceReducer from "./Slices/StatSlice.js";
import commentSlice from "./Slices/CommentSlice.js";
import testSlice from "./Slices/testSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course: courseSliceReducer,
    razorpay: razorpaySliceReducer,
    lecture: lectureSliceReducer,
    stat: statSliceReducer,
    comment: commentSlice,
    test: testSlice,
  },
  devTools: true,
});

export default store;
