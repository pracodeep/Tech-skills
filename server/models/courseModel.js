const{ Schema, model } =require ("mongoose");

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minLength: [8, "Title must be atleast 8 characters"],
      maxLength: [50, "Title cannot be more than 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [20, "Description must be atleast 20 characters long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    createdBy: {
      type: String,
      required: [true, "course instructor name is required"],
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "lectures",
      },
    ],
    test: [
      {
        type: Schema.Types.ObjectId,
        ref: "mcqs",
      },
    ],
    numberOfLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("courses", courseSchema);

module.exports=Course