import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './styles.css'; // Import your CSS file

const JobCard = ({ job, toggleBookmark }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarkIcon, setShowBookmarkIcon] = useState(false);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const isBookmarkedJob = savedBookmarks.some(bookmarkedJob => bookmarkedJob.id === job.id);
    setIsBookmarked(isBookmarkedJob);
  }, [job]);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      toggleBookmark(job);
      setIsBookmarked(true);
      setShowBookmarkIcon(true);
      setTimeout(() => setShowBookmarkIcon(false), 1000);
    },
    onSwipedLeft: () => {
      toggleBookmark(job);
      setIsBookmarked(false);
      setShowBookmarkIcon(false);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
      {showBookmarkIcon && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <FaBookmark size={100} className="text-yellow-500 animate-bounce" />
        </div>
      )}
      <div
        {...handlers}
        className="job-card"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="job-title">{job?.title}</h2>
          <button
            onClick={() => toggleBookmark(job)}
            className={`focus:outline-none ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} transition-colors duration-300`}
          >
            {isBookmarked ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
          </button>
        </div>
        <p className="job-details">Location: {job?.primary_details?.Place}</p>
        <p className="job-details">
          Salary: {job?.primary_details?.Salary === '-' ? '-' : `${job?.primary_details?.Salary}`}
        </p>
        <div className='flex justify-between items-center'>
          <Link to={`/jobs/${job?.id}`} state={{ job }} className="link">
            View Details
          </Link>
          <a href={job.custom_link} className="link">
            {job.button_text}
          </a>
        </div>
      </div>
    </>
  );
};

export default JobCard;
