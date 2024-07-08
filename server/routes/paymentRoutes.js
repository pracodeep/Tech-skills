
const { Router } =require ("express");
const {
  allPayments,
  buySubscription,
  getRazorpayApiKey,
  unsubscribe,
  verifySubscription,
} =require ("../controllers/paymentController.js");
const { authorizedRoles, isLoggedIn } =require ("../middlewares/authMiddleware.js");

const router = Router();

router.get("/razorpay-key", isLoggedIn, getRazorpayApiKey);

router.get("/subscribe", isLoggedIn, buySubscription);

router.post("/verify", isLoggedIn, verifySubscription);

router.post("/unsubscribe", isLoggedIn, unsubscribe);

router.get("/", isLoggedIn, authorizedRoles("ADMIN"), allPayments);

module.exports= router;
