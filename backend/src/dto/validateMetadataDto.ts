import { MetadataStandard } from '../common/types';

export class ValidateMetadataDTO {
  hash: string;
  url: string;
  standard?: MetadataStandard;
  noStandard?: boolean;
}

