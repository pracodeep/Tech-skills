const { Schema, model } =require ("mongoose");
const bcrypt =require ("bcryptjs");
const crypto =require("crypto");
const jwt =require("jsonwebtoken");

const userSchema = new Schema(
  {
    fullName: {
      type: "String",
      required: [true, "Name is Required"],
      minLength: [5, "Name Must be atlease 5 charcter"],
      maxLength: [50, "Name should be less than 50 charcter"],
      lowercae: true,
      trim: true, // Removes unnecessary spaces
    },
    email: {
      type: "String",
      required: [true, "Email is required"],
      lowercae: true,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ], // Matches email against regex
    },
    password: {
      type: "String",
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 charcters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: "String",
      },
      secure_url: {
        type: "String",
      },
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
      id: String,
      status: String,
    },
    watchHistory: {
      type: Map,
      of: [String], // Array of lecture IDs
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Hashes password before saving to the database
userSchema.pre("save", async function (next) {
  // If password is not modified then do not hash it
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  // method which will help us compare plain password with hashed password and returns true or false
  comparePassword: async function (planeTextPassword) {
    return await bcrypt.compare(planeTextPassword, this.password);
  },

  // Will generate a JWT token with user id as payload
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  // This will generate a token for password reset
  generatePasswordResetToken: async function () {
    // creating a random token using node's built-in crypto module
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Adding forgot password expiry to 15 minutes
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15min from now

    return resetToken;
  },
};

const User = model("users", userSchema);

module.exports=User