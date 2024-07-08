
// export const calculateProgress = (totalLecture, watchedLectures) => {
//   if (totalLecture === 0) return 0;
//   const res = (watchedLectures / totalLecture) * 100;
//   return res.toFixed(0);
// };

export function formatDate(createdAt) {
    const currentDate = new Date();
    const commentDate = new Date(createdAt);
  
    const timeDifferenceInMilliseconds = currentDate - commentDate;
  
    const secondsDifference = Math.floor(timeDifferenceInMilliseconds / 1000);
  
    const minutesDifference = Math.floor(secondsDifference / 60);
  
    const hoursDifference = Math.floor(minutesDifference / 60);
  
    const daysDifference = Math.floor(hoursDifference / 24);
  
    const monthsDifference = Math.floor(daysDifference / 30);
  
    const yearsDifference = Math.floor(monthsDifference / 12);
  
    if (yearsDifference > 0) {
      return `${yearsDifference} ${yearsDifference === 1 ? "year" : "years"} ago`;
    } else if (monthsDifference > 0) {
      return `${monthsDifference} ${
        monthsDifference === 1 ? "month" : "months"
      } ago`;
    } else if (daysDifference > 0) {
      return `${daysDifference} ${daysDifference === 1 ? "day" : "days"} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference} ${
        minutesDifference === 1 ? "minute" : "minutes"
      } ago`;
    } else {
      return `${secondsDifference} ${
        secondsDifference === 1 ? "second" : "seconds"
      } ago`;
    }
  }
  