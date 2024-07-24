import { governanceActionProcessor } from './governanceActionProcessor';
import { imageProcessor } from './imageProcessor';
import { pdfProcessor } from './pdfProcessor';
import { youtubeVimeoProcessor } from './youtubeVimeoProcessor';

export const processNoteContent = (content) => {

  const processors = [
    pdfProcessor,
    youtubeVimeoProcessor,
    imageProcessor,
    governanceActionProcessor,
  ];

  let processedContent = content;
  
  processors.forEach((processor) => {
    processedContent = processor(processedContent);
  });

  return processedContent;
};
