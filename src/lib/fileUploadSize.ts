export const isValidFileSize = (size: any) => {
  console.log('size is', size);
  const sizeInMB = (size / (1024 * 1024)).toFixed(2);
  console.log('sizeInMB is', sizeInMB);
  return Number(sizeInMB) <= 10.0;
};
