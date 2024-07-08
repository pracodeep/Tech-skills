
import React from "react";
import Comment from "./Comment";
import { useSelector } from "react-redux";

const CommentList = () => {
  const { comments, commentReplies } = useSelector((state) => state?.comment);

  // Memoize the Comment component
  const MemoizedComment = React.memo(Comment);

  return (
    <>
      {comments.map((comment) => {
        return (
          <div key={comment._id + Math.random()}>
            <Comment commentData={comment} />
            {comment.isShowReplies &&
              commentReplies[comment._id] &&
              commentReplies[comment._id].map((reply) => (
                <>
                  <div
                    key={reply._id}
                    className="pl-5 border border-l-black ml-10"
                  >
                    <MemoizedComment commentData={reply} />
                  </div>
                </>
              ))}
          </div>
        );
      })}
    </>
  );
};

export default CommentList;
