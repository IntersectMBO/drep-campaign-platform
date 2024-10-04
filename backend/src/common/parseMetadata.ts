import { Logger } from '@nestjs/common';
import { LoggerMessage, MetadataStandard } from './types';

// todo: check cip-100 metadata standards
export const parseMetadata = (
  metadata: any,
  standard = MetadataStandard.CIP100,
) => {
  const parsedMetadata = {};
  for (const [key, value] of Object.entries(metadata)) {
    //will parse refrences with upcoming versions
    // if (key === 'references') {
    //   parsedMetadata[key] = (Array.isArray(value) ? value : [])?.map(
    //     (reference) => reference?.uri['@value'],
    //   );
    // }
    parsedMetadata[key] = value['@value'];
  }
  Logger.debug(LoggerMessage.PARSED_METADATA_BODY, parsedMetadata, {
    standard,
  });
  return JSON.stringify(parsedMetadata);
};
