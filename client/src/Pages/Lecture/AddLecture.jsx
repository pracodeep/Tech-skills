
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCourseLecture } from "../../Redux/Slices/LectureSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineArrowLeft } from "react-icons/ai";

const AddLecture = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCourse } = useSelector((state) => state.course);

  const [lectureDetails, setLectureDetails] = useState({
    courseId: currentCourse?._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: "",
    material: undefined,
  });

  useEffect(() => {
    if (!currentCourse) {
      navigate("/courses");
    }
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLectureDetails({
      ...lectureDetails,
      [name]: value,
    });
  }

  function handleVideo(e) {
    const video = e.target.files[0];
    const source = window.URL.createObjectURL(video);

    setLectureDetails({
      ...lectureDetails,
      lecture: video,
      videoSrc: source,
    });
  }

  // Added function to handle material upload
  function handleMaterial(e) {
    const materialFile = e.target.files[0];
    setLectureDetails({
      ...lectureDetails,
      material: materialFile,
    });
  }

  async function addNewLecture(e) {
    e.preventDefault();
    if (
      !lectureDetails.lecture ||
      !lectureDetails.title ||
      !lectureDetails.description
    ) {
      toast.error("All field are mandatory");
      return;
    }
    const response = await dispatch(addCourseLecture(lectureDetails));

    if (response?.payload?.success) {
      setLectureDetails({
        courseId: currentCourse._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
      });
      navigate(-1);
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
        <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
          <header className="flex items-center justify-center relative">
            <button
              className="absolute left-2 text-2xl text-green-500"
              onClick={() => navigate(-1)}
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-2xl text-yellow-500 font-semibold">
              Add new Lecture
            </h1>
          </header>
          <form className="flex flex-col gap-3" onSubmit={addNewLecture}>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="enter title of the lecture"
              onChange={handleInputChange}
              className="bg-transparent px-3 py-1 border"
              value={lectureDetails.title}
            />
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="enter the description of the lecture"
              onChange={handleInputChange}
              className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
              value={lectureDetails.description}
            />
            {lectureDetails.videoSrc ? (
              <video
                muted
                src={lectureDetails.videoSrc}
                controls
                controlsList="nodownload nofullscreen"
                disablePictureInPicture
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
              ></video>
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label
                  htmlFor="lecture"
                  className="font-semibold text-xl cursor-pointer"
                >
                  Choose your video
                </label>
                <input
                  type="file"
                  name="lecture"
                  id="lecture"
                  className="hidden"
                  onChange={handleVideo}
                  accept="video/mp4 video/x-mp4 video/*"
                />
              </div>
            )}
            {/* metarial upload Input */}
            <input
              type="file"
              name="material"
              id="material"
              onChange={handleMaterial}
              accept=".pdf, .docx, .ppt, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint"
              className="file-input file-input-bordered w-full max-w-xs"
            />

            <button
              type="submit"
              className="btn btn-primary py-1 font-semibold text-lg"
            >
              Add new Lecture
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AddLecture;
