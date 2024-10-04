export const imageProcessor = (content: string) => {
  const imageRegex =
    /\!\[([^\]]+)\]\((?:<a[^>]*href=")?(https?:\/\/[^\s)]+(\.[a-zA-Z]{3,4}))(?:\"[^>]*>.*?<\/a>)?\)/g;

  const imageEmbed = (url: string, text: string) =>
    `<div class="relative pb-1/2 xl:w-3/4 my-4">
        <img src="${url}" alt="${text}" class="absolute w-full h-full object-cover rounded-lg" />
    </div>`;

  content = content.replace(imageRegex, (_, text, url) =>
    imageEmbed(url, text),
  );
  return content;
};
