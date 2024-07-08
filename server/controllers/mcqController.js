const Course =require ("../models/courseModel.js");
const Mcq =require ("../models/mcqModel.js");
const AppError =require ("../utils/error.js");

/**
 * @ADD_MCQ
 * @ROUTE @POST {{URL}}/api/v1/mcqs/addMcq/:courseId
 * @ACCESS Private (Admin Only)
 */
 const addMcqByCourseId = async (req, res, next) => {
  try {
    // Extract the course ID from request parameters
    const { courseId } = req.params;

    // Extract MCQ data from request body
    const { question, options, correctOptionIndex } = req.body;

    if (correctOptionIndex < 0 || correctOptionIndex > 3) {
      return next(new AppError("correctOptionIndex is from 0 to 3", 400));
    }

    // Validate the required fields
    if (!question || !options) {
      return next(new AppError("All fields are required", 400));
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Invalid ID or Course does not exist.", 404));
    }

    // Create a new MCQ document
    const newMcq = new Mcq({
      question,
      options,
      correctOptionIndex,
    });

    // Save the new MCQ document
    const savedMcq = await newMcq.save();

    // Push the MCQ ID into the course's mcqs array
    course.test.push(savedMcq._id);

    // Save the updated course document
    await course.save();

    res.status(201).json({
      success: true,
      message: "MCQ added successfully",
      data: savedMcq,
    });
  } catch (error) {
    console.error("Error adding MCQ:", error);
    res.status(500).json({ success: false, message: "failed to Add MCQ" });
  }
};

/**
 * @ALL_MCQS
 * @ROUTE @GET {{URL}}/api/v1/mcqs/:courseId
 * @ACCESS Private (only authorizeSubscriber)
 */
const getAllMcqsById = async (req, res, next) => {
  try {
    // Extract the course ID from request parameters
    const { courseId } = req.params;
    const { role } = req.user;

    // Find the course by ID and populate the 'mcqs' field with actual MCQ documents
    let course;
    if (role === "USER") {
      course = await Course.findById(courseId).populate({
        path: "test",
        select: "-correctOptionIndex",
      });
    } else {
      course = await Course.findById(courseId).populate("test");
    }

    // If no course is found with the provided ID, return a 404 error
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: " getAllMcqs successfully",
      data: course.test,
    });
  } catch (error) {
    console.error("Error In getAllMcqsById", error);
    res.status(500).json({ success: false, message: " failed to getAllMcqs" });
  }
};

/**
 * @UPDATE_MCQ
 * @ROUTE @PUT {{URL}}/api/v1/lectures/editMcq/:courseId/:mcqId
 * @ACCESS Private (Admin only)
 */
 const editMcqById = async (req, res, next) => {
  try {
    // Extract courseId and mcqId from request parameters
    const { courseId, mcqId } = req.params;

    // Check if the course exists
    const course = await Course.findById(courseId);

    // If the course does not exist, return a 404 error
    if (!course) {
      return next(new AppError("Course Not Found", 404));
    }

    // Find the MCQ by its ID
    const mcq = await Mcq.findById(mcqId);

    // If the MCQ does not exist, return a 404 error
    if (!mcq) {
      return next(new AppError("MCQ Not Found", 404));
    }

    // Update the existing MCQ with the new data
    Object.assign(mcq, req.body);

    // Save the updated MCQ
    const updatedMcq = await mcq.save();

    // If the MCQ ID is present in the course's mcqs array, update it
    if (course.test.includes(mcqId)) {
      // Find the index of the MCQ ID in the course's mcqs array
      const mcqIndex = course.test.indexOf(mcqId);

      // Replace the old MCQ ID with the updated MCQ ID
      course.test.splice(mcqIndex, 1, updatedMcq._id);

      // Save the updated course
      await course.save();
    } else {
      res.status(500).json({
        success: false,
        message: "Mcq ID not found in the course's mcqs array",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mcq updated successfully",
      data: updatedMcq,
    });
  } catch (error) {
    console.error("Error while updating mcq", error);
    res.status(500).json({ success: false, message: "failed to update MCQ" });
  }
};

/**
 * @Delete_MCQ
 * @ROUTE @DELETE {{URL}}/api/v1/lectures/deleteMcq/:courseId/:mcqId
 * @ACCESS Private (Admin only)
 */
 const deleteMcqById = async (req, res, next) => {
  try {
    // Extract courseId and mcqId from request parameters
    const { courseId, mcqId } = req.params;

    // Check if the course exists
    const course = await Course.findById(courseId);

    // If the course does not exist, return a 404 error
    if (!course) {
      return next(new AppError("Course Not Found", 404));
    }

    // Find the MCQ by ID and delete it
    const deletedMcq = await Mcq.findByIdAndDelete(mcqId);

    // If no MCQ was found with the provided ID, return a 404 error
    if (!deletedMcq) {
      return next(new AppError("MCQ Not Found", 404));
    }

    // Remove the MCQ ID from the course's mcqs array
    const mcqIndex = course.test.indexOf(mcqId);
    if (mcqIndex !== -1) {
      course.test.splice(mcqIndex, 1);
    }

    // Save the updated course without the deleted MCQ ID
    await course.save();

    res.status(200).json({
      success: true,
      message: "MCQ deleted successfully",
      data: deletedMcq._id,
    });
  } catch (error) {
    console.error("Error while deleting mcq:", error);
    res.status(500).json({ success: false, message: "failed to delete MCQ" });
  }
};

 const submitTest = async (req, res) => {
  const { courseId } = req.params;
  const { selectedAnswers } = req.body;

  console.log("selectedAnswers", selectedAnswers);

  const course = await Course.findById(courseId).populate({
    path: "test",
    select: "-question -options", // Exclude multiple properties
  });

  let obtainMarks = 0;

  course.test.forEach((mcq) => {
    const selectedIndex = selectedAnswers[mcq._id];
    if (selectedIndex === mcq.correctOptionIndex) {
      obtainMarks++;
    }
  });

  const totalMarks = course.test.length;

  const per = (obtainMarks * 100) / totalMarks;

  let result;
  if (per >= 70) {
    result = "pass";
  } else {
    result = "fail";
  }

  console.log("taka", per);

  res.status(200).json({
    message: "test submited done",
    success: true,
    obtainMarks: obtainMarks,
    totalMarks: totalMarks,
    result: result,
  });
};

module.exports={
  addMcqByCourseId,
  getAllMcqsById,
  editMcqById,
  deleteMcqById,
  submitTest
}