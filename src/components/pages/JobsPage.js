
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Loader from "../Loader";
import Cookies from 'js-cookie';
import { useSwipeable } from 'react-swipeable';

const JobCard = ({ job, toggleBookmark }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [showBookmarkIcon, setShowBookmarkIcon] = useState(false);




  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const isBookmarkedJob = savedBookmarks.some(bookmarkedJob => bookmarkedJob.id === job.id);
    setIsBookmarked(isBookmarkedJob);
  }, [job]);

  const handleBookmarkToggle = (direction) => {
    setShowBookmarkIcon(true);
    if (direction === 'right') {
      toggleBookmark(job, true);
      setIsBookmarked(true);
    } else if (direction === 'left') {
      toggleBookmark(job, false);
      setIsBookmarked(false);
    }
    setTimeout(() => {
      setShowBookmarkIcon(false);
    }, 1000);
  };

  const handlers = useSwipeable({
    onSwipedRight: () => {
      setSwipeDirection('right');
      handleBookmarkToggle('right');
      console.log('Job bookmarked');
    },
    onSwipedLeft: () => {
      setSwipeDirection('left');
      handleBookmarkToggle('left');
      console.log('Job dismissed');
    },
    onSwiped: () => {
      setTimeout(() => setSwipeDirection(''), 300);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
    {showBookmarkIcon==="trst" && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
        <FaBookmark size={100} className="text-yellow-500 animate-bounce" />
      </div>
    )}
    <div className={`relative w-full transition-transform duration-300 
      ${swipeDirection === 'right' ? 'bg-green-300' : ''} 
      ${swipeDirection === 'left' ? 'bg-red-300' : ''}`} 
      style={{ minHeight: '150px' }}
    >
      <div 
        {...handlers} 
        className={`bg-white border border-gray-200 rounded-lg p-4 mb-4 transition-transform duration-300 w-full hover:scale-105 hover:border-rainbow hover:shadow-rainbow    relative
          ${swipeDirection === 'right' ? 'translate-x-full' : ''} 
          ${swipeDirection === 'left' ? '-translate-x-full' : ''}`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <button
            onClick={() => handleBookmarkToggle(isBookmarked ? 'left' : 'right')}
            className={`focus:outline-none ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} transition-colors duration-300`}
          >
            {isBookmarked ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
          </button>
        </div>
        <p className="text-gray-700 mb-2">Location: {job.primary_details.Place}</p>
        <p className="text-gray-700 mb-2">Salary: {job.primary_details.Salary === '-' ? '-' : `${job.primary_details.Salary}`}</p>
        <Link to={`/jobs/${job.id}`} className="text-blue-500 font-semibold" state={{ job }}>View Details</Link>
      </div>
      {/* Display bookmark status in the swipe area */}
      {swipeDirection && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${swipeDirection === 'right' ? 'bg-green-300' : 'bg-red-300'}`} 
          style={{ opacity: 0.7 }}
        >
          <p className={`text-white text-2xl font-bold ${swipeDirection === 'right' ? 'text-left' : 'text-right'}`} 
            style={{ 
              textAlign: 'center',
              userSelect: 'none', 
              minWidth: '100%', 
              fontSize: '2rem', 
              position: 'absolute',
              left: 0,
              right: 0,
              top: '20%'
            }}
          >
            {swipeDirection === 'right' ? 'Bookmarked' : 'Dismissed'}
          </p>
        </div>
      )}
    </div>
    </>
  );
};





function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);


  useEffect(() => {
    const savedBookmarks = Cookies.get('bookmarkedJobs');
    if (savedBookmarks) {
      setBookmarkedJobs(JSON.parse(savedBookmarks)); 
    }
  }, []);


  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const newJobs = response.data.results.filter(job => job.id != null); 
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');

      setJobs(prevJobs => [...prevJobs, ...newJobs]);
      //localStorage.setItem('jobs', JSON.stringify([...jobs, ...newJobs]));
      Cookies.set('jobs', JSON.stringify([...savedBookmarks,...jobs, ...newJobs]), { expires: 7, path: '/' });

      if (newJobs.length === 0) {
        setHasMore(false);
      } else {
        setJobs(prevJobs => [...prevJobs, ...newJobs]);

       
      
      }
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);


  const toggleBookmark = (job, shouldBookmark) => {
    const existingBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const isBookmarked = existingBookmarks.some(bookmarkedJob => bookmarkedJob.id === job.id);
    
    let updatedBookmarks;
  
    if (shouldBookmark) {
      // Add to bookmarks if not already bookmarked
      if (!isBookmarked) {
        updatedBookmarks = [...existingBookmarks, job];
      } else {
        updatedBookmarks = existingBookmarks; // already bookmarked, no change
      }
    } else {
      // Remove from bookmarks
      updatedBookmarks = existingBookmarks.filter(bookmarkedJob => bookmarkedJob.id !== job.id);
    }
  
    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
    Cookies.set('bookmarkedJobs', JSON.stringify(updatedBookmarks), { expires: 7, path: '/' });
  };
  

  const loadMoreJobs = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  //  console.log("storedJobs: ", storedJobs);
    const matchingJobs = jobs.filter(newJob =>
      storedJobs.some(storedJob => storedJob.id === newJob.id)
    );
   // console.log("Matching Jobs: ", matchingJobs);
  }, [jobs])
  
  console.log("ERRROR 6")
  return (
    <div className="p-4 mb-5">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div key={index} className=''//flex justify-around
            >
              <JobCard job={job} toggleBookmark={toggleBookmark} bookmarkedJobs={bookmarkedJobs} />
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>

      <div className="text-center mt-4">
        {loading && <Loader />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && hasMore && (
          <button onClick={loadMoreJobs} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Load More
          </button>
        )}
        {!hasMore && <p>No more details found.</p>}
      </div>
    </div>
  );
}


export default JobsPage;



/*const JobCard = ({ job, toggleBookmark, bookmarkedJobs }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [startX, setStartX] = useState(0);
  const [swipeThreshold] = useState(100); // Minimum swipe distance

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const isBookmarkedJob = savedBookmarks.some(bookmarkedJob => bookmarkedJob.id === job.id);
    setIsBookmarked(isBookmarkedJob);
  }, [job]);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    if (diffX > swipeThreshold) {
      setSwipeDirection('right');
    } else if (diffX < -swipeThreshold) {
      setSwipeDirection('left');
    }
  };

  const handleTouchEnd = () => {
    if (swipeDirection === 'right') {
      toggleBookmark(job);
      setIsBookmarked(prev => !prev);
    }
    setSwipeDirection(''); // Reset
  };

  return (
    <div
      className={`job-card ${swipeDirection === 'left' ? 'swipe-left' : ''} ${swipeDirection === 'right' ? 'swipe-right' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <button
          onClick={() => {
            toggleBookmark(job);
            setIsBookmarked(prev => !prev);
          }}
          className={`focus:outline-none ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} transition-colors duration-300`}
        >
          {isBookmarked ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
        </button>
      </div>
      <p className="text-gray-700 mb-2">Location: {job.primary_details.Place}</p>
      <p className="text-gray-700 mb-2">Salary: {job.primary_details.Salary === '-' ? '-' : `${job.primary_details.Salary}`}</p>
      <Link to={`/jobs/${job.id}`} className="text-blue-500 font-semibold">View Details</Link>
    </div>
  );
};*/

