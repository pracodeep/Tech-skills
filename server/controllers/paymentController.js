const User =require ("../models/userModel.js");
const Payment =require ("../models/paymentModel.js");
const { razorpayInstance }=require ("../server.js");
const AppError =require("../utils/error.js");
const crypto =require ("crypto");

const getRazorpayApiKey = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Razorpay Api Key",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("unauthorized, please login"));
    }

    if (user.subscription.status === "active") {
      return next(new AppError("user have already active subscription"));
    }

    if (user.role == "ADMIN") {
      return next(new AppError("Admin cannot perchase a subscription", 400));
    }

    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      quantity: 1,
      total_count: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "subscription successfully",
      subscription_id: subscription.id,
      subscription,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("unauthorized, please login"));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment not verified, please try again", 500));
    }

    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const unsubscribe = async (req, res, next) => {
  console.log("req.user =>", req.user);
  const { id } = req.user;

  const user = await User.findById(id);

  if (user.role === "ADMIN") {
    return next(
      new AppError("Admin does not need to cannot cancel subscription", 400)
    );
  }

  console.log("user", user);

  const subscriptionId = user.subscription.id;

  try {
    const subscription = await razorpayInstance.subscriptions.cancel(
      subscriptionId
    );

    console.log("subscription", subscription);

    user.subscription.status = subscription.status;

    console.log("user before saving", user);

    await user.save();
  } catch (error) {
    return next(new AppError(error.error.description, error.statusCode));
  }
};

const allPayments = async (req, res, next) => {
  try {
    const { count } = req.query;

    const subscriptions = await razorpayInstance.subscriptions.all({
      count: count || 10,
    });

    res.status(200).json({
      success: true,
      message: "All payments",
      subscriptions,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports={
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  unsubscribe,
  allPayments
}