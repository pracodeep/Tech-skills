
const { Router } =require ("express");
const {
  addMcqByCourseId,
  deleteMcqById,
  editMcqById,
  getAllMcqsById,
  submitTest,
} =require ("../controllers/mcqController.js");
const {
  authorizeSubscriber,
  authorizedRoles,
  isLoggedIn,
} =require ("../middlewares/authMiddleware.js");

const router = Router();

router
  .route("/getAllMcqs/:courseId")
  .get(isLoggedIn, authorizeSubscriber, getAllMcqsById);

router
  .route("/addMcq/:courseId")
  .post(isLoggedIn, authorizedRoles("ADMIN"), addMcqByCourseId);

router
  .route("/deleteMcq/:courseId/:mcqId")
  .delete(isLoggedIn, authorizedRoles("ADMIN"), deleteMcqById);

router
  .route("/editMcq/:courseId/:mcqId")
  .put(isLoggedIn, authorizedRoles("ADMIN"), editMcqById);

router
  .route("/submitTest/:courseId")
  .post(isLoggedIn, authorizeSubscriber, submitTest);

module.exports = router;
