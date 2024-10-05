import React, { useEffect, useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const JobCard = ({ job, toggleBookmark, dismissJob }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const isBookmarkedJob = savedBookmarks.some(bookmarkedJob => bookmarkedJob.id === job.id);
    setIsBookmarked(isBookmarkedJob);
  }, [job]);

  return (
    <div className="job-card">
      <h2 className="job-title">{job.title}</h2>
      <p className="job-location">Location: {job.primary_details?.Place}</p>
      <p className="job-salary">Salary: {job.primary_details?.Salary}</p>
      <button onClick={() => toggleBookmark(job)} className="bookmark-button">
        {isBookmarked ? <FaBookmark color="gold" /> : <FaRegBookmark />} Bookmark
      </button>
      <button onClick={() => dismissJob(job.id)} className="dismiss-button">Dismiss</button>
    </div>
  );
};

export default JobCard;
