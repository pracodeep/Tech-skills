const User =require ("../models/userModel.js");
const AppError =require ("../utils/error.js");
const sendEmail =require ("../utils/sendEmail.js");

// Controller function for handling the contact us endpoint
 const contactUs = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError("All fileds are required", 400));
  }

  try {
    const emailMessage = `  
    <html>
      <body>
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      </body>
    </html>`;

    // Sending a contact us email to the organization
    await sendEmail(process.env.CONTACT_US_EMAIL, "Contact Us", emailMessage);

    const userMessage = `
    <html>
      <body>
        <h2>Thank You for Contacting Us, ${name}!</h2>
        <p>
          Hello ${name},<br><br>
          Thank you for contacting us! We have received your message and will get in touch with you soon.
        </p>
        <p>Best regards,<br>The LMS Team 😊</p>
      </body>
    </html>
  `;

    // replying a thank you email to the user
    await sendEmail(email, "Thank You for Contacting Us", userMessage);

    res.status(200).json({
      success: true,
      message:
        "Thanks for contacting, We have send you a confirmation email and will get in touch with you soon",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

 const stats = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    const allUserCount = allUsers.length;
    const subscribedUserCount = allUsers.filter(
      (user) => user.subscription.status === "active"
    ).length;

    res.status(200).json({
      success: true,
      message: "stats",
      allUserCount,
      subscribedUserCount,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports={
  contactUs,
  stats
}