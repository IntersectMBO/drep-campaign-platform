import { Logger } from '@nestjs/common';
import {
  LoggerMessage,
  MetadataStandard,
  MetadataValidationStatus,
} from './types';
import { cipStandardSchema } from './schemas/cipMetadataSchema';
import { normalizeJSONld } from './normalizeJSONld';
const renderValue = (value: any) => {
  if (typeof value === 'object' && value['@value']) {
    return value['@value'];
  }
  if (typeof value === 'string'){
    return value;
  }
  return JSON.stringify(value);
};
export const validateMetadataStandard = async (
  data: Record<string, any>,
  standard: MetadataStandard,
) => {
  try {
    //trying to emulate govtool's schema validation
    //jsonld->json
    if (data?.body) data.body = await normalizeJSONld(data?.body);
    if (data?.hashAlgorithm)
      data.hashAlgorithm = renderValue(data?.hashAlgorithm);
    await cipStandardSchema[standard]?.validateAsync(data);
  } catch (error) {
    Logger.error(LoggerMessage.METADATA_VALIDATION_ERROR, error);
    throw MetadataValidationStatus.INCORRECT_FORMAT;
  }
};
