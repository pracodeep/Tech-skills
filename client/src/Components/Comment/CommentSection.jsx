
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentInLecture,
  clearOldComments,
  getLectureComments,
} from "../../Redux/Slices/CommentSlice.js";
import toast from "react-hot-toast";
import CommentList from "./CommentList.jsx";

const CommentsSection = ({ lectureId }) => {
  const dispatch = useDispatch();

  const { currentLecture } = useSelector((state) => state?.lecture);

  const [commentContent, setCommentContent] = useState("");
  const [pageCount, setPageCount] = useState(-1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(clearOldComments());
    setHasMoreComments(true);
    setLoading(false);
    setPageCount(0);
    setCommentContent("");
  }, [currentLecture]);

  async function handleLoadComments() {
    if (!loading && hasMoreComments) {
      setLoading(true);
      try {
        const res = await dispatch(
          getLectureComments({ lectureId, page: pageCount + 1 })
        );

        if (res?.payload?.data?.length === 0) {
          setHasMoreComments(false);
        } else {
          setPageCount(pageCount + 1);
        }
      } catch (error) {
        console.error("Error loading comments:", error);
        toast.error(error?.message || "something went wrong");
      } finally {
        setLoading(false);
      }
    }
  }

  function handleAddComment() {
    dispatch(addCommentInLecture({ content: commentContent, lectureId }));
    setCommentContent("");
  }

  return (
    <div className="text-yellow-500 font-custom line-clamp-4 p-10 rounded-lg w-full lg:p-0 sm:mt-4 sm:text-xs">
      <h2 className="text-lg font-semibold mb-4">Comments :</h2>
      <div className="mb-6 mt-4">
        <div className="w-full">
          <div className="flex items-end gap-10 sm:flex-col sm:gap-2">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              id="commentInput"
              className="w-full h-20 bg-slate-900 border border-gray-600 focus:border-gray-500 rounded-md p-2 focus:outline-none resize-none"
              placeholder="Write your comment here..."
            ></textarea>
            <button
              onClick={handleAddComment}
              disabled={!commentContent}
              id="addCommentBtn"
              className="btn btn-active btn-info sm:btn-sm"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>

      <CommentList />

      {loading ? (
        <div className="flex items-center gap-3 justify-center my-5">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <div className="flex items-center justify-center my-5 ">
          <button
            onClick={handleLoadComments}
            disabled={!hasMoreComments}
            className="btn btn-active btn-info sm:btn-sm"
          >
            {hasMoreComments ? "Load Comments ..." : "No more comments"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
