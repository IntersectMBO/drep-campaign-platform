export const youtubeVimeoProcessor = (content: string) => {
  const youtubeRegex =
    /\[([^\]]+)\]\((?:<a[^>]*href=")?(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&")]+))(?:\"[^>]*>.*?<\/a>)?\)/g;
  const vimeoRegex =
    /\[([^\]]+)\]\((?:<a[^>]*href=")?(https?:\/\/(?:www\.)?vimeo\.com\/([^\s)]+))(?:\"[^>]*>.*?<\/a>)?\)/g;

  const youtubeEmbed = (id: string, text: string) =>
    `<div class="aspect-video my-4">
      <iframe 
        style="display: block !important; visibility: visible !important;" 
        class="w-full h-full rounded-lg" 
        src="https://www.youtube.com/embed/${id}" 
        title="${text}" 
        frameborder="0" 
        allow="accelerometer; 
        autoplay; 
        clipboard-write; 
        encrypted-media; 
        gyroscope; 
        picture-in-picture; 
        web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen>
      </iframe>
    </div>`;
  const vimeoEmbed = (id: string) =>
    `<div class="aspect-video my-4">
      <iframe 
        style="display: block !important; visibility: visible !important;" 
        class="w-full h-full rounded-lg" 
        src="https://player.vimeo.com/video/${id}" 
        frameborder="0" 
        allow="autoplay; 
        fullscreen; 
        picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>`;

  content = content.replace(youtubeRegex, (_, text, url, id) =>
    youtubeEmbed(id, text),
  );
  content = content.replace(vimeoRegex, (_, text, url, id) => vimeoEmbed(id));
  return content;
};
