import {
  CIP_100,
  CIP_108,
  CIP_119,
  createDREPContext,
} from './drepActions/jsonContext';
import { generateJsonld } from './generateJSONLD';
import { blake2bHex } from 'blakejs';
import { getExternalMetadata } from '@/services/requests/postExternalMetadataUrl';
import { v4 as uuidv4 } from 'uuid';
import { getItemFromLocalStorage, setItemToLocalStorage } from './localStorage';
import { renderJsonldValue } from '@/components/atoms/MetadataViewer';
type StandardReference = typeof CIP_100 | typeof CIP_108 | typeof CIP_119;

type MetadataConfig = {
  data: Record<string, unknown>;
  standardReference: StandardReference;
};

/**
 * Generates the metadata body based on the provided configuration.
 *
 * @param {MetadataConfig} config - The configuration object containing
 * the data and standard reference.
 * @returns {Object} - The generated metadata body.
 */
export const generateMetadataBody = ({
  data,
  standardReference,
}: MetadataConfig) => {
  const filteredData = Object.entries(data).map(([key, value]) => [
    standardReference + key,
    value,
  ]);
  if (typeof data?.references === 'string') {
    data.references = JSON.parse(data.references);
  }
  const references = data?.references
    ? (data.references as Array<{ uri?: string; label: string }>)
        .filter((link) => link.uri)
        .map((link) => ({
          '@type': 'Other',
          [`${CIP_100}reference-label`]: link.label || 'Label',
          [`${CIP_100}reference-uri`]: link.uri,
        }))
    : undefined;

  const body = Object.fromEntries(filteredData);

  if (data?.references) {
    body[`${standardReference}references`] = references;
  }
  return body;
};

export const processExternalMetadata = async ({ metadataUrl }) => {
  const res = await getExternalMetadata({
    metadataUrl,
  });
  const jsonLdData = res;
  const jsonHash = blake2bHex(JSON.stringify(jsonLdData), undefined, 32);
  const modifiedJson = renderJSONLDToJSONArr(jsonLdData);
  return {
    jsonLdData,
    modifiedJson,
    jsonHash,
  };
};
export const renderJSONLDToJSON = (jsonld: any) => {
  const modifiedJsonArr = renderJSONLDToJSONArr(jsonld);
  const modifiedMetadata = modifiedJsonArr.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
  return modifiedMetadata;
};
export const renderJSONLDToJSONArr = (jsonld: any) => {
  const modifiedJsonArr = Object.entries(jsonld.body).map(
    ([key, value]: any[]) => {
      const valueString = renderJsonldValue(value);
      return { id: uuidv4(), key: key, value: valueString };
    },
  );
  if (jsonld?.body?.image){
    const imageJson = {
      id: uuidv4(),
      key: 'image',
      value: {
        contentUrl: jsonld.body.image.contentUrl,
        sha256: jsonld.body.image.sha256,
      }
    };
    modifiedJsonArr.map((item) => {
      if (item.key === 'image') {
        item.value = imageJson.value;
      }
    });
  }
  if (jsonld?.body?.references) {
    const referencesJson = jsonld.body.references.map((ref) => {
      return {
        id: uuidv4(),
        key: ref.label?.['@value'] || ref.label,
        value: ref.uri?.['@value'] || ref.uri,
      };
    });
    modifiedJsonArr.map((item) => {
      if (item.key === 'references') {
        item.value = referencesJson;
      }
    });
  }

  return modifiedJsonArr;
};

export const submitMetadata = async (
  metadataKeys: string[],
  data: any[],
  loginSignTransaction: () => Promise<any>,
  vkeys?: any,
) => {
  try {
    let currentVKeys = vkeys;
    const dynamicDREPContext = createDREPContext(metadataKeys);
    const jsonLdData = await generateMetadataBody({
      data: data as any,
      standardReference: CIP_119,
    });
    // Sign metadata transaction if vkeys are not provided
    if (!currentVKeys) {
      // Check for keys in local storage
      const storedVKeys = getItemFromLocalStorage('signatures');
      if (storedVKeys) {
        const { signature, key: vkey } = storedVKeys;
        currentVKeys = {
          vkey,
          signature,
        };
      } else {
        const { signature, key: vkey } = await loginSignTransaction();
        currentVKeys = {
          vkey,
          signature,
        };
        // Optionally store vkeys in local storage for future use
        setItemToLocalStorage('signatures', currentVKeys);
      }
    }
    const jsonld = await generateJsonld(
      jsonLdData,
      dynamicDREPContext,
      CIP_119,
      currentVKeys,
    );
    //hasing the raw kay value pairs to be validated
    const jsonHash = blake2bHex(JSON.stringify(jsonld), undefined, 32);

    return {
      jsonHash,
      jsonld,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
