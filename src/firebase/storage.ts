import storage from '@react-native-firebase/storage';

export const storageRef = (ref: any) => {
  return storage().ref(ref);
};

export const chatImages = (file: any) => {
  const fileName = new Date().getTime();
  return storageRef(`messages/documents/${fileName}`).putFile(file);
};
