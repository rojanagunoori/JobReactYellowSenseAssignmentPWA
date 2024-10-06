import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import JobDetailPage from './JobDetailsPage';

const JobDetailsTesting = () => {
    const [testing,setTesting]=useState(false)
    const location = useLocation();
    useEffect(() => {
        if (location?.state !== null) {
        
          setTesting(false);
         
        }else{
            setTesting(true)
        }
      }, [location?.state]);
  return (
    <div>{testing?"No data found":<JobDetailPage/>}</div>
  )
}

export default JobDetailsTesting