import React from 'react';

const VideoNotFound = () => {

  return (
    <div className='not-found'>
      <h1>404: Video Not Found</h1>
      <p>Sorry, the video you are looking for could not be found.</p>
    </div>
  )
};

const PageNotFound = () => {

return (
    <div className='not-found'>
      <h1>404: Page Not Found</h1>
      <p>Sorry, the video you are looking for could not be found.</p>
    </div>
  )
}

const ChannelNotFound = () => {

  return (
    <div className='not-found'>
      <h1>404: Channel Not Found</h1>
      <p>Sorry, the video you are looking for could not be found.</p>
    </div>
  )
}

export { PageNotFound, VideoNotFound, ChannelNotFound };

