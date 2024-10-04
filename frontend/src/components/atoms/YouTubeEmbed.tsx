import React, { memo } from 'react';

type YouTubeEmbedProps = { videoId: string; title: string };

const YouTubeEmbed = memo(({ videoId, title }: YouTubeEmbedProps) => (
  <div className="my-4 aspect-video">
    <iframe
      style={{ display: 'block', visibility: 'visible' }}
      className="h-full w-full rounded-lg"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; 
        autoplay; 
        clipboard-write; 
        encrypted-media; 
        gyroscope; 
        picture-in-picture; 
        web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  </div>
));

export default YouTubeEmbed;
