import {storage} from '../../../firebase';
import {http} from '../../../lib/http';

const docStorage = (file: any) => {
  return new Promise((resolve, reject) => {
    storage
      .chatImages(file)
      .then((data: any) => {
        console.log('storage data', data)
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

const sendMessage = (id: any, obj: any) => {
  const messageObj = {
    conversation: {
      message: {
        ...obj[0],
      },
    },
  };
  // console.log('messageObj is', messageObj);
  return new Promise((resolve, reject) => {
    http
      .put(`v1/conversations/${id}`, messageObj)
      .then(response => {
        // console.log('Send response is', response);
        resolve(response);
      })
      .catch(error => {
        console.log('error is', error);
        reject(error);
      });
  });
};

export {docStorage, sendMessage};
