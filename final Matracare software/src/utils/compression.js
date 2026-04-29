import LZString from 'lz-string';

export const compressData = (jsonString) => {
  return LZString.compressToEncodedURIComponent(jsonString);
};

export const decompressData = (compressedString) => {
  return LZString.decompressFromEncodedURIComponent(compressedString);
};
