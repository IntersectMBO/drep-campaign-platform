import { VimeoEmbed } from '@/components/atoms/VimeoEmbed';
import YouTubeEmbed from '@/components/atoms/YouTubeEmbed';
import React from 'react';


export const youtubeVimeoProcessor = (content: (string | JSX.Element)[]): (string | JSX.Element)[] => {
  const youtubeRegex = /\[([^\]]+)\]\((?:<a[^>]*href=")?(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&")]+))(?:\"[^>]*>.*?<\/a>)?\)/g;
  const vimeoRegex = /\[([^\]]+)\]\((?:<a[^>]*href=")?(https?:\/\/(?:www\.)?vimeo\.com\/([^\s)]+))(?:\"[^>]*>.*?<\/a>)?\)/g;

  return content.flatMap((item) => {
    if (typeof item !== 'string') {
      return item;
    }

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = youtubeRegex.exec(item)) !== null) {
      const [fullMatch, text, url, id] = match;
      const startIndex = match.index;
      const endIndex = youtubeRegex.lastIndex;

      if (startIndex > lastIndex) {
        parts.push(item.substring(lastIndex, startIndex));
      }

      parts.push(<YouTubeEmbed key={`youtube-${id}`} videoId={id} title={text} />);

      lastIndex = endIndex;
    }

    while ((match = vimeoRegex.exec(item)) !== null) {
      const [fullMatch, text, url, id] = match;
      const startIndex = match.index;
      const endIndex = vimeoRegex.lastIndex;

      if (startIndex > lastIndex) {
        parts.push(item.substring(lastIndex, startIndex));
      }

      parts.push(<VimeoEmbed key={`vimeo-${id}`} videoId={id} />);

      lastIndex = endIndex;
    }

    if (lastIndex < item.length) {
      parts.push(item.substring(lastIndex));
    }
    return parts;
  });
};
