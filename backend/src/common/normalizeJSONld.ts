export const normalizeJSONld = async (data: Record<string, unknown>) => {
  if (typeof data === 'object' && data !== null) {
    // Normalize the data to the expected format
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        // Check if the value is an object with a '@value' property
        if (typeof value === 'object' && value !== null && '@value' in value) {
          return [key, value['@value']];
        }
        // Normalize the 'references' field
        if (key === 'references') {
          if (typeof value === 'string') {
            try {
              return [key, JSON.parse(value)];
            } catch (e) {
              return [key, []];
            }
          } else if (Array.isArray(value)) {
            return [key, value];
          } else {
            return [key, []];
          }
        }
        // Otherwise, return the value as is
        return [key, value];
      }),
    );
  }
  return data;
};
