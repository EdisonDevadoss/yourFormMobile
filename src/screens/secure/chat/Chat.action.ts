import {storage} from '../../../firebase';

const docStorage = (file: any) => {
  return new Promise((resolve, reject) => {
    storage
      .chatImages(file)
      .then((data: any) => {
        storage
          .storageRef(data.metadata.fullPath)
          .getDownloadURL()
          .then((url: any) => {
            resolve(url);
          });
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export {docStorage};
