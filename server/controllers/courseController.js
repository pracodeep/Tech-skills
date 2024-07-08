const Course =require ("../models/courseModel.js");
const AppError =require ("../utils/error.js");
const cloudinary=require ("cloudinary");
const fs =require ("fs/promises");

/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */
 const getAllCourses = async (req, res, next) => {
  try {
    // Find all the courses without lectures
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @GET_LECTURES_BY_COURSE_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private(ADMIN, subscribed users only)
 */
 const getLecturesByCourseId = async (req, res, next) => {
  try {
    console.log("hii");
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id or course not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @CREATE_COURSE
 * @ROUTE @POST {{URL}}/api/v1/courses
 * @ACCESS Private (admin only)
 */
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: "temp public_id",
        secure_url: "temp secure_url",
      },
    });

    if (!course) {
      return next(new AppError("Coures Creation failed,try Again", 500));
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "LMS",
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      fs.rm(`uploads/${req.file.filename}`);
    }

    await course.save();

    res.status(201).json({
      succes: true,
      message: "coures created succssfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @UPDATE_COURSE_BY_ID
 * @ROUTE @PUT {{URL}}/api/v1/courses/:id
 * @ACCESS Private (Admin only)
 */
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!course) {
      return next(new AppError("Coures With given id does not exits", 404));
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "LMS",
      });

      // Ensure that course.thumbnail is an object
      course.thumbnail =
        typeof course.thumbnail === "[object,object]" ? course.thumbnail : {};

      if (result) {
        course.thumbnail.public_id = result?.public_id;
        course.thumbnail.secure_url = result?.secure_url;
      }

      fs.rm(`uploads/${req.file.filename}`);
    }

    await course.save();

    res.status(200).json({
      succes: true,
      message: "coures updated succssfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @DELETE_COURSE_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/courses/:id
 * @ACCESS Private (Admin only)
 */
 const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coures = await Course.findByIdAndDelete(id);

    if (!coures) {
      return next(new AppError("Coures With given id does not exits", 404));
    }

    res.status(201).json({
      success: true,
      message: "coures deleted succssfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getSuggestions = async (req, res, next) => {
  const { query } = req.query;

  try {
    const suggestions = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { createdBy: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).select("title createdBy category");

    console.log("suggestions", suggestions);

    // Filter suggestions based on whether they contain the query
    const suggestionStrings = suggestions
      .flatMap((course) => [course.title, course.createdBy, course.category])
      .filter((string) => string.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10); // Limit to the first 10 strings

    const uniqueSet = new Set(suggestionStrings);

    const uniqueArray = [...uniqueSet];

    res.status(200).json({
      success: true,
      suggestionStrings: uniqueArray,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
 module.exports={
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  updateCourse,
  deleteCourse,
  getSuggestions,


 }