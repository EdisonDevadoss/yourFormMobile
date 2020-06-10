import RNFileSelector from 'react-native-file-selector';
import {docStorage} from '../screens/secure/chat/Chat.action';

const getDocument = () => {
  return new Promise((resolve, reject) => {
    RNFileSelector.Show({
      onCancel: () => {
        reject('cancelled');
      },
      onDone: (path: any) => {
        const splitedPath = path.split('/');
        const fileName = splitedPath[splitedPath.length - 1];
        const result = {
          fileName,
          path,
        };
        resolve(result);
      },
      title: 'Select File',
    });
  });
};

const documentUpload = (path: string) => {
  return new Promise((resolve, reject) => {
    docStorage(path)
      .then((url: any) => {
        resolve(url);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export {getDocument, documentUpload};
