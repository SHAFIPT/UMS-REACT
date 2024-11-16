import React from 'react';
import Loading from '../../assets/netflix_spinner.gif';

// Update the LoadingSpinner component
const LoadingSpinner = () => {
  return (
    <div className='w-[100%] h-[100vh] flex items-center justify-center bg-black'>
      {/* Add your spinner GIF here */}
      <img src={Loading} alt="Loading..." width="200" height="200" />
    </div>
  );
}

export default LoadingSpinner;