// import downloadDoc from '../../images/clip.png';
import React from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity} from 'react-native';

const renderCustomView = (props: any) => {
  const {currentMessage} = props;
  const openVideo = () => {
    Linking.openURL(currentMessage.doc);
  };
  if (currentMessage.doc) {
    return (
      <TouchableOpacity onPress={openVideo} style={styles.imageView}>
        <Image
          style={styles.imageStyle}
          source={require('../../images/clip.png')}
        />
        <Text style={styles.textStyle}>{currentMessage.fileName}</Text>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  imageStyle: {
    height: 25,
    margin: 6,
    width: 25,
  },
  imageView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textStyle: {
    color: '#FFF',
    marginHorizontal: 5,
    textAlign: 'center',
  },
});

export default renderCustomView;
