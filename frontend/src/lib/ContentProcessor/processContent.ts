import { governanceActionProcessor } from './governanceActionProcessor';
import { imageProcessor } from './imageProcessor';
import { pdfProcessor } from './pdfProcessor';
import { youtubeVimeoProcessor } from './youtubeVimeoProcessor';


export const processContent = (content) => {

  const processors = [
    pdfProcessor,
    imageProcessor,
    governanceActionProcessor,
    youtubeVimeoProcessor,
  ];

  let processedContent = content;
  
  processors.forEach((processor) => {
    processedContent = processor(processedContent);
  });

  return processedContent;
};
