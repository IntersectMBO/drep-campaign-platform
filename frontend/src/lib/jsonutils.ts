import * as jsonld from 'jsonld';

export const downloadJson = (json: jsonld.NodeObject, fileName?: string) => {
  const jsonString = `data:text/jsonld;charset=utf-8,${encodeURIComponent(
    JSON.stringify(json, null, 2),
  )}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `${fileName || 'data'}.jsonld`;

  link.click();
};

export const downloadTextFile = (text: string, fileName?: string) => {
  const blob = new Blob([text], { type: 'text/utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName || 'data'}.txt`;

  link.click();
};
export const canonizeJSON = async (json: Record<string, unknown>) => {
  const canonized = await jsonld.canonize(json);
  return canonized;
};
