const fs =require("fs/promises");

const User=require ("../models/userModel.js");
const AppError =require( "../utils/error.js");
const cloudinary =require("cloudinary");
const sendEmail =require("../utils/sendEmail.js");
const crypto =require("crypto");
const Course =require ("../models/courseModel.js");
const { generatePdf } =require("../utils/generatePdf.js");
const  emailHtmltemplate=require("../utils/emailHtmltemplate.js");
const { log } = require("console");

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

/**
 * @REGISTER
 * @ROUTE @POST {{URL}}/api/v1/user/register
 * @ACCESS Public
 */
 const register = async (req, res, next) => {
  // console.log("base url", req.baseUrl);
  // console.log("original Url", req.originalUrl);
  // console.log("body", req.body);
  // console.log("cookie", req.cookies);
  // console.log("file", req.file);
  // console.log("host", req.hostname);
  // Destructuring the necessary data from req object
  try {
    const { fullName, email, password } = req.body;

    // Check if the data is there or not, if not throw error message
    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Check if the user exists with the provided email
    const userExists = await User.findOne({ email });

    // If user exists send the reponse else it's null
    if (userExists) {
      return next(new AppError("Email is already Exists", 400));
    }

    // Create new user with the given necessary data and save to DB
    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
    });

    // If user not created send message response
    if (!user) {
      return next(
        new AppError("user registration failed,plase try again", 400)
      );
    }

    // Run only if user sends a file else it's undefined
    if (req.file) {
      try {
        const uploadedImageInfo = await cloudinary.v2.uploader.upload(
          req.file.path,
          {
            folder: "LMS", // Save files in a folder named lms
            width: 250,
            height: 250,
            gravity: "faces", // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
            crop: "fill",
          }
        );

        // If success
        if (uploadedImageInfo) {
          // Set the public_id and secure_url in DB
          user.avatar.public_id = uploadedImageInfo.public_id;
          user.avatar.secure_url = uploadedImageInfo.secure_url;
        }

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        return next(
          new AppError(error || "File not uploaded, please try again", 400)
        );
      }
    }

    // Save the user object
    await user.save();

    // Generating a JWT token
    const token = await user.generateJWTToken();

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie("token", token, cookieOptions);

    // If all good send the response to the frontend
    res.status(201).json({
      success: true,
      message: "User Register successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @ACCESS Public
 */
 const login = async (req, res, next) => {
  try {
    // Destructuring the necessary data from req object
    const { email, password } = req.body;

    // Check if the data is there or not, if not throw error message
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Finding the user with the sent email
    const user = await User.findOne({ email }).select("+password");

    // If no user or sent password do not match then send generic response
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Email and password does not match"));
    }

    // Generating a JWT token
    const token = await user.generateJWTToken();

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie("token", token, cookieOptions);

    // If all good send the response to the frontend
    res.status(200).json({
      success: true,
      message: "user loggedIn successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @LOGOUT
 * @ROUTE @POST {{URL}}/api/v1/user/logout
 * @ACCESS Public
 */
 const logout = (req, res) => {
  // Setting the cookie value to null
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  // Sending the response
  res.status(200).json({
    success: true,
    message: "user logout successfully",
  });
};

/**
 * @LOGGED_IN_USER_DETAILS
 * @ROUTE @GET {{URL}}/api/v1/user/me
 * @ACCESS Private(Logged in users only)
 */
 const getProfile = async (req, res) => {
  try {
    // Finding the user using the id from modified req object
    const user = await User.findById(req.user.id);

    res.status(200).json({
      sucesss: true,
      message: "User datails",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch user Profile!!"));
  }
};

/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset
 * @ACCESS Public
 */
 const forgotPassword = async (req, res, next) => {
  // Extracting email from request body
  const { email } = req.body;

  // If no email send email required message
  if (!email) {
    return next(new AppError("Email is Required", 400));
  }

  // Finding the user via email
  const user = await User.findOne({ email });

  // If no email found send the message email not found
  if (!user) {
    return next(new AppError("Email is not Registered", 400));
  }

  // Generating the reset token via the method we have in user model
  const resetToken = await user.generatePasswordResetToken();

  // Saving the forgotPassword* to DB
  await user.save();

  // constructing a url to send the correct data
  /**HERE
   * req.protocol will send if http or https
   * req.get('host') will get the hostname
   * the rest is the route that we will create to verify if token is correct or not
   */
  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/user/reset/${resetToken}`;

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // We here need to send an email to the user with the token
  const subject = "Reset Password";
  const message = emailHtmltemplate(resetPasswordURL);

  try {
    await sendEmail(email, subject, message);

    // If email sent successfully send the success response
    res.status(200).json({
      suceess: true,
      message: `Reset Password token has been send to ${email} successfully`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();
    return next(new AppError(error.message, 500));
  }
};

/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset/:resetToken
 * @ACCESS Public
 */
const resetPassword = async (req, res, next) => {
  try {
    // Extracting resetToken from req.params object
    console.log("req.params log :", req.params);
    const { resetToken } = req.params;

    // Extracting password from req.body object
    const { password } = req.body;

    // Check if password is not there then send response saying password is required
    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
    const forgotPasswordToken = await crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Checking if token matches in DB and if it is still valid(Not expired)
    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    // If not found or expired send the response
    if (!user) {
      return next(
        new AppError("Token is Invalid or Expired,please Try Again", 400)
      );
    }

    // Update the password if token is valid and not expired
    user.password = password;

    // making forgotPassword* valus undefined in the DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    // Saving the updated user values
    await user.save();

    // Sending the response when everything goes good
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @CHANGE_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/change-password
 * @ACCESS Private (Logged in users only)
 */
 const changePassword = async (req, res) => {
  try {
    // Destructuring the necessary data from the req object
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user; // because of the middleware isLoggedIn

    // Check if the values are there or not
    if (!oldPassword || !newPassword) {
      return next(new AppError("All fields are mandatory", 400));
    }

    // Finding the user by ID and selecting the password
    const user = await User.findById(id).select("+password");

    // If no user then throw an error message
    if (!user) {
      return next(new AppError("User does not Exits"));
    }

    // Check if the old password is correct
    const isPasswordValid = await user.comparePassword(oldPassword);

    // If the old password is not valid then throw an error message
    if (!isPasswordValid) {
      return next(new AppError("Invalid Old Password", 400));
    }

    // Setting the new password
    user.password = newPassword;

    // Save the data in DB
    await user.save();

    // Setting the password undefined so that it won't get sent in the response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/update/:id
 * @ACCESS Private (Logged in user only)
 */
 const updateUserProfile = async (req, res) => {
  try {
    // Destructuring the necessary data from the req object
    const { fullName } = req.body;
    const { id } = req.user || req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User does not exits", 400));
    }

    if (fullName) {
      user.fullName = fullName;
    }

    // Run only if user sends a file
    if (req.file) {
      // Deletes the old image uploaded by the user
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "LMS",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        return next(
          new AppError(error || "File not uploaded, please try again", 400)
        );
      }
    }

    // Save the user object
    await user.save();

    res.status(200).json({
      success: true,
      message: "user details updated successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

 const markLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const { id } = req.user; // because of the middleware isLoggedIn

    let user = await User.findById(id);

    if (!user) {
      res.json({ success: false, error: "User Not Found" });
    }

    // Update watchedLectures for the courseId
    if (!user.watchHistory.has(courseId)) {
      user.watchHistory.set(courseId, []);
    }

    const markedLecture = user.watchHistory.get(courseId);

    if (!markedLecture.includes(lectureId)) {
      markedLecture.push(lectureId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Lecture Marked",
      data: user.watchHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "error while mark Lecture" });
  }
};
const unMarkLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const { id } = req.user; // because of the middleware isLoggedIn

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Update watchedLectures for the courseId
    if (!user.watchHistory.has(courseId)) {
      res.status(404).json({
        success: false,
        message: "Course not found in watched lectures",
      });
    }

    const courseLectures = user.watchHistory?.get(courseId);

    const index = courseLectures.indexOf(lectureId);

    if (index != -1) {
      user.watchHistory.get(courseId).splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Remove from Watch Lecture",
      data: user.watchHistory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "error while unmark The Lecture" });
  }
};

 const getWatchHistory = async (req, res) => {
  try {
    const { id } = req.user; // because of the middleware isLoggedIn

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ success: false, error: "User Not Found" });
    }

    if (user?.watchHistory) {
      res.status(200).json({
        success: true,
        message: "fetch User Watch History",
        data: user.watchHistory,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User watch History not found",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      error: "error while getting User Watch watchHistory",
    });
  }
};

 const generateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const userData = await User.findById(userId);

    const courseData = await Course.findById(courseId);

    const filePath = await generatePdf(userData, courseData);

    // Send the generated PDF file as response
    res.download(filePath, "certificate.pdf", (err) => {
      if (err) {
        console.error("Error sending certificate:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Delete the generated file after sending
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    });
  } catch (error) {
    console.error(e);
    res.status(500).json({
      success: false,
      error: "error while generateCertificate",
    });
  }
};

module.exports={
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserProfile,
  markLecture,
  unMarkLecture,
  getWatchHistory,
  generateCertificate
}