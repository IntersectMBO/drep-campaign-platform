import React from 'react';

export const VimeoEmbed = ({ videoId }: { videoId: string }) => (
  <div className="aspect-video my-4">
    <iframe
      style={{ display: 'block', visibility: 'visible' }}
      className="w-full h-full rounded-lg"
      src={`https://player.vimeo.com/video/${videoId}`}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  </div>
);
