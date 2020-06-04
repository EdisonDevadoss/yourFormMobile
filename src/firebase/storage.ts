import storage from '@react-native-firebase/storage';

const fileName = new Date().getTime();

export const storageRef = (ref: any) => {
  return storage().ref(ref);
};

export const chatImages = (file: any) => {
  return storageRef(`messages/documents/${fileName}`).putFile(file);
};
