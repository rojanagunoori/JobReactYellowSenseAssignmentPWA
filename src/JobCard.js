// JobCard.js
import React from 'react';

const JobCard = ({ job, onSwipeLeft, onSwipeRight }) => {
  return (
    <div className="job-card">
      <h2>{job.title}</h2>
      <p>{job.company}</p>
      <p>{job.location}</p>
      {/* Add more job details as needed */}
      <button onClick={onSwipeLeft}>Dismiss</button>
      <button onClick={onSwipeRight}>Bookmark</button>
    </div>
  );
};

export default JobCard;
