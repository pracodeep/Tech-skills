
const { Router } =require ("express");
const {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSuggestions,
  updateCourse,
} =require ("../controllers/courseController.js");
const { authorizedRoles, isLoggedIn } =require ("../middlewares/authMiddleware.js");
const upload =require ("../middlewares/multerMiddleware.js");

const router = Router();

// Route for getting suggestions should come before routes with :id parameter
router.route("/suggestions").get(getSuggestions);

router
  .route("/")
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    upload.single("thumbnail"),
    createCourse
  );
// .delete(isLoggedIn, authorizedRoles("ADMIN"), removeLecterFromCourse);

router
  .route("/:id")
  .put(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    upload.single("thumbnail"),
    updateCourse
  )
  .delete(isLoggedIn, authorizedRoles("ADMIN"), deleteCourse);

// router
//   .route("/:id")
//   .get(isLoggedIn, authorizeSubscriber, getLecturesByCourseId)
//   .put(
//     isLoggedIn,
//     authorizedRoles("ADMIN"),
//     upload.single("thumbnail"),
//     updateCourse
//   )
//   .delete(isLoggedIn, authorizedRoles("ADMIN"), deleteCourse)
//   .post(
//     isLoggedIn,
//     authorizedRoles("ADMIN"),
//     upload.single("lecture"),
//     addLectureToCourseById
//   );

module.exports= router;
