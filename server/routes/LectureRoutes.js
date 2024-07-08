const { Router } =require ("express");
const {
  addLectureByCourseId,
  // changeWatchStatus,
  deleteLecturebyId,
  getLecturesById,
  updateLecturebyId,
} =require ("../controllers/LectureController.js");
const {
  authorizeSubscriber,
  authorizedRoles,
  isLoggedIn,
} =require ("../middlewares/authMiddleware.js");
const upload =require ("../middlewares/multerMiddleware.js");

const router = Router();

router.get("/:courseId", isLoggedIn, authorizeSubscriber, getLecturesById);
``;


router.post(
  "/addLecture/:courseId",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  upload.fields([
    { name: "lecture", maxCount: 1 },
    { name: "material", maxCount: 1 },
  ]),
  addLectureByCourseId
);

router.delete(
  "/deleteLecture/:courseId/:lectureId",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  deleteLecturebyId
);

router.put(
  "/updateLecture/:courseId/:lectureId",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  upload.fields([
    { name: "lecture", maxCount: 1 },
    { name: "material", maxCount: 1 },
  ]),
  updateLecturebyId
);

module.exports= router;