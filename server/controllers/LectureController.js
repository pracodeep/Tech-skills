const Course =require ("../models/courseModel.js");
const cloudinary =require( "cloudinary");
const AppError =require ("../utils/error.js");
const uploadFile =require ("../utils/uploadFile.js");
const Lecture =require ("../models/LectureModel.js");

/**
 * @ALL_LECTURES
 * @ROUTE @GET {{URL}}/api/v1/lectures/:courseId
 * @ACCESS Private (only authorizeSubscriber)
 */
 const getLecturesById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course by its ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Retrieve all lectures using the lecture IDs associated with the course
    const lectures = await Lecture.find({ _id: { $in: course.lectures } });

    // Send the fetched lectures as a response
    res.status(200).json({
      success: true,
      lectures: lectures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lectures",
      error: error.message,
    });
  }
};

/**
 * @ADD_LECTURE
 * @ROUTE @POST {{URL}}/api/v1/lectures/addLecture/:courseId
 * @ACCESS Private (Admin Only)
 */
 const addLectureByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const { lecture, material } = req.files || {};

    // Validate request data
    if (!title || !description) {
      return next(new AppError("Title and Description are required", 400));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Invalid course id or course not found.", 400));
    }

    // Upload lecture file
    const lectureData = lecture
      ? await uploadFile(lecture[0], "video", "/DevSkillz/Lectures")
      : {};

    // Upload material file
    const materialData = material
      ? await uploadFile(material[0], "raw", "/DevSkillz/Materials")
      : {};

    // Create new lecture document
    const newLecture = new Lecture({
      title,
      description,
      lecture: lectureData,
      material: materialData,
    });

    // Save the new lecture
    const savedLecture = await newLecture.save();

    // Add the ID of the new lecture to the course's lectures array
    course.lectures.push(savedLecture._id);

    // Update the number of lectures in the course
    course.numberOfLectures = course.lectures.length;

    // Save the updated course
    await course.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "Course lecture added successfully",
      savedLecture,
    });
  } catch (error) {
    console.log("error whie adding lecture", error);
    return next(new AppError(error.message, 500));
  }
};

/**
 * @Delete_LECTURE
 * @ROUTE @DELETE {{URL}}/api/v1/lectures/deleteLecture/:courseId/:lectureId
 * @ACCESS Private (Admin only)
 */
const deleteLecturebyId = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params;

    // Find the lecture by its ID
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return next(new AppError("Lecture not found.", 404));
    }

    // Delete lecture file from Cloudinary (if exists)
    if (lecture.lecture && lecture.lecture.public_id) {
      await cloudinary.v2.uploader.destroy(lecture.lecture.public_id);
    }

    // Delete material file from Cloudinary (if exists)
    if (lecture.material && lecture.material.public_id) {
      await cloudinary.v2.uploader.destroy(lecture.material.public_id);
    }

    // Remove the lecture from the database
    await Lecture.findByIdAndDelete(lectureId);

    // Remove lecture ID from the associated course
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { lectures: lectureId } },
      { new: true }
    );

    // Update the number of lectures in the course
    course.numberOfLectures = course.lectures.length;

    // Save the updated course
    await course.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting lecture:", error);
    return next(new AppError(error.message, 500));
  }
};

/**
 * @UPDATE_LECTURE
 * @ROUTE @PUT {{URL}}/api/v1/lectures/updateLecture/:courseId/:lectureId
 * @ACCESS Private (Admin only)
 */
const updateLecturebyId = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { title, description } = req.body;
    const { lecture, material } = req.files || {};

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Validate request data
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and Description are required",
      });
    }

    // Find the lecture by ID
    const existingLecture = await Lecture.findById(lectureId);
    if (!existingLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Upload lecture and material files if included in the request
    let lectureData = existingLecture.lecture;
    let materialData = existingLecture.material;

    if (lecture) {
      const uploadedLecture = await uploadFile(
        lecture[0],
        "video",
        "/DevSkillz/Lectures"
      );
      lectureData = {
        public_id: uploadedLecture.public_id,
        secure_url: uploadedLecture.secure_url,
      };
    }

    if (material) {
      const uploadedMaterial = await uploadFile(
        material[0],
        "raw",
        "/DevSkillz/Materials"
      );
      materialData = {
        public_id: uploadedMaterial.public_id,
        secure_url: uploadedMaterial.secure_url,
      };
    }

    // Update the lecture data
    existingLecture.set({
      title,
      description,
      lecture: lectureData,
      material: materialData,
    });

    // Save the updated lecture
    const updatedLecture = await existingLecture.save();

    // Update the course's lecture array with the updated lecture ID
    const lectureIndex = course.lectures.indexOf(lectureId);
    if (lectureIndex !== -1) {
      course.lectures[lectureIndex] = updatedLecture._id;
    } else {
      console.error("Lecture ID not found in the course's lectures array");
    }

    // Save the updated course
    await course.save();

    // Send success response with updated lecture data
    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture: updatedLecture,
    });
  } catch (error) {
    console.log("Error while updating lecture:", error);
    return next(new AppError(error.message, 500));
  }
};


module.exports={
  getLecturesById,
  addLectureByCourseId,
  deleteLecturebyId,
  updateLecturebyId

}