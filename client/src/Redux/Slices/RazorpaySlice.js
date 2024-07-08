import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance.js";
import { toast } from "react-hot-toast";

const initialState = {
  key: null,
  subscription_id: null,
  isPaymentVarified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
};

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
  try {
    const res = await axiosInstance.get("/payments/razorpay-key");
    return res?.data;
  } catch (error) {
    toast.error("failed to load data");
  }
});

export const purchaseCourseBundle = createAsyncThunk(
  "/purchaseCourse",
  async () => {
    try {
      const res = await axiosInstance.get("/payments/subscribe");
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const varifyUserPayment = createAsyncThunk(
  "/payment/verify",
  async (data) => {
    try {
      const res = await axiosInstance.post("/payments/verify", {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_subscription_id: data.razorpay_subscription_id,
        razorpay_signature: data.razorpay_signature,
      });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getPaymentRecord = createAsyncThunk(
  "/payment/record",
  async () => {
    const loadingMessage = toast.loading("Getting the payment records ...");
    try {
      const res = await axiosInstance.get("/payments?count=10");
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const cancelCourseBundle = createAsyncThunk(
  "/payment/cancel",
  async () => {
    const loadingMessage = toast.loading("unsubscribing the bundle ...");
    try {
      const res = await axiosInstance.post("/payments/unsubscribe");
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action?.payload?.key;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscription_id;
      })
      .addCase(varifyUserPayment.fulfilled, (state, action) => {
        toast.success(action?.payload?.message);
        state.isPaymentVarified = action?.payload?.success;
      })
      .addCase(varifyUserPayment.rejected, (state, action) => {
        toast.success(action?.payload?.message);
        state.isPaymentVarified = action?.payload?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.subscriptions;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      })
      .addCase(cancelCourseBundle.fulfilled, (state) => {
        state.key = "";
        state.subscription_id = "";
        state.isPaymentVarified = false;
        state.allPayments = {};
        state.finalMonths = {};
        state.monthlySalesRecord = [];
      });
  },
});

export default razorpaySlice.reducer;