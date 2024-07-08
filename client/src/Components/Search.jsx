
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSuggestions,
  searchCourse,
  setFilterCourseData,
} from "../Redux/Slices/CourseSlice";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dispatch = useDispatch();

  const { suggestions } = useSelector((state) => state.course);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getSuggestions(searchQuery));
    }, 200);

    if (searchQuery == "") {
      dispatch(setFilterCourseData());
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  function onSuggestionClick(selectedSuggestion) {
    setSearchQuery(selectedSuggestion);
    setShowSuggestions(false);
    dispatch(searchCourse(selectedSuggestion));
  }

  return (
    <div className="col-span-10 px-16 md:px-8 sm:px-2 relative">
      <div className="flex w-full">
        <input
          autoComplete="off"
          className="px-5 p-2 sm:p-1 rounded-l-md shadow-md  sm:px-3 w-1/2 md:w-full border border-gray-400 outline-none border-none"
          type="text"
          id="searchBar"
          name="searchBar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          placeholder="Search Courses"
        />
        <button
          onClick={() => onSuggestionClick(searchQuery)}
          className="border w-16 bg-yellow-600 border-black-500 rounded-r-md text-gray-300 outline-none border-none"
        >
          Search
        </button>
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-20 sm:left-10 sm:text-sm mt-5 bg-white py-2 px-2 w-[37rem] sm:w-[21rem] shadow-lg rounded-lg border border-gray-100 opacity-90 z-50">
          <ul>
            {suggestions.map((s) => (
              <li
                key={s}
                onMouseDown={(e) => {
                  onSuggestionClick(s);
                }}
                className="cursor-pointer py-2 px-3 flex items-center justify-start gap-2 shadow-sm text-black hover:bg-gray-100"
              >
                <FaSearch /> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
