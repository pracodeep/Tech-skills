const Router=require("express")
const {
  changePassword,
  forgotPassword,
  generateCertificate,
  getProfile,
  getWatchHistory,
  login,
  logout,
  markLecture,
  register,
  resetPassword,
  unMarkLecture,
  updateUserProfile,
} =require( "../controllers/userController.js");
const  { isLoggedIn }=require ("../middlewares/authMiddleware.js");
const  upload =require ("../middlewares/multerMiddleware.js");

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/change-password", isLoggedIn, changePassword);
router.put(
  "/update/:id",
  isLoggedIn,
  upload.single("avatar"),
  updateUserProfile
);

router.put("/mark-lecture", isLoggedIn, markLecture);

router.put("/unmark-lecture", isLoggedIn, unMarkLecture);

router.get("/watchHistory", isLoggedIn, getWatchHistory);

router.post("/generate/certificate", isLoggedIn, generateCertificate);

module.exports=router