// TODO: Remove this file once we standardize keys in a single format
export const isSameKey = (key1: string, key2: string): boolean => {
  return key1.replace(/-\d+$/, "").toString() === key2.replace(/-\d+$/, "").toString();
};
