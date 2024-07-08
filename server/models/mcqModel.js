const{ Schema, model } =require ("mongoose");

const mcqSchema = new Schema({
  question: {
    type: String,
    require: [true, "question is required"],
    trim: true,
  },
  options: {
    type: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  correctOptionIndex: {
    type: Number,
    required: [true, "Correct option index is required"],
    min: 0,
    max: 3,
  },
});

// Middleware to validate options array length before saving
mcqSchema.pre("save", function (next) {
  if (this.options.length !== 4) {
    return next(new Error("Exactly 4 options are required"));
  }
  // Check if all options are unique after trimming
  const uniqueOptions = new Set(this.options.map((option) => option.trim()));
  if (uniqueOptions.size !== this.options.length) {
    return next(new Error("All options Should be Unique"));
  }
  next();
});

const Mcq = model("mcqs", mcqSchema);

module.exports = Mcq;