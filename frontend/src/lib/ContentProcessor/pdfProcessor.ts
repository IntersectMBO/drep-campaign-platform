export const pdfProcessor = (content: string) => {
  const pdfRegex =
    /\[([^\]]+)\]\(\s*(?:<a[^>]*href=")?(https?:\/\/[^\s)]+\.pdf)(?:"[^>]*>.*?<\/a>)?\s*\)/g;

  const pdfEmbed = (text: string, pdfLink: string) => {
    const filenameMatch = pdfLink.match(/\/([^/]+\.pdf)$/);
    const filename = filenameMatch ? filenameMatch[1] : 'Unknown File';

    return `<div class="bg-bar_back px-4 py-1 my-2 w-auto inline-flex rounded">
              <a href="${pdfLink}" target="_blank" class="flex items-center gap-2">
                <img src="/svgs/notesvgs/pdf.svg" alt="${text} pdf" class="w-9 h-12" />
                <p class="text-titles font-medium leading-5">${filename}</p>
              </a>
            </div>`;
  };

  content = content.replace(pdfRegex, (_, text, pdfLink) =>
    pdfEmbed(text, pdfLink),
  );

  return content;
};
