
import { useSelector } from "react-redux";
import LectureItem from "./LectureItem";

const LecturesList = () => {
  const { lectures } = useSelector((state) => state?.lecture);
  return (
    <>
      {lectures.map((lecture, index) => {
        return (
          <LectureItem
            key={lecture._id + Math.random()}
            lecture={lecture}
            index={index}
          />
        );
      })}
    </>
  );
};

export default LecturesList;
