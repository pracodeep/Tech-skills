
const { Router }=require ("express");
const { isLoggedIn } =require ("../middlewares/authMiddleware.js");
const {
  addCommentInLecture,
  addReplyToComment,
  getLectureComments,
  getReplysOfComment,
} =require("../controllers/commentController.js");

const router = Router();

router.get("/getLectureComments/:lectureId", isLoggedIn, getLectureComments);

router.post("/addComment/:lectureId", isLoggedIn, addCommentInLecture);

router.post("/addReplyToComment/:commentId", isLoggedIn, addReplyToComment);

router.get("/getReplys/:commentId", isLoggedIn, getReplysOfComment);

// router.delete("/deleteComment/:commentId", deleteComment);

// router.put("/editComment/:commentId", editComment);

module.exports= router;
