
const {mongoose, Schema, model }=require ("mongoose");

const lectureSchema = Schema({
  title: String,
  description: String,
  lecture: {
    public_id: {
      type: String,
      required: [true, "public_id is required"],
    },
    secure_url: {
      type: String,
      required: [true, "secure_url is required"],
    },
  },
  material: {
    public_id: {
      type: String,
      required: [true, "public_id is required"],
    },
    secure_url: {
      type: String,
      required: [true, "secure_url is required"],
    },
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
});

const Lecture = model("lectures", lectureSchema);

module.exports=Lecture;
