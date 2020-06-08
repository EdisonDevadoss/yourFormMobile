/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Icon} from 'native-base';
import {Bubble} from 'react-native-gifted-chat';
import {StyleSheet, TouchableOpacity} from 'react-native';

const RenderAudio = (props: any) => {
  return (
    <TouchableOpacity
      style={styles.imageStyle}
      onPress={() => props.onAudioPress(props.currentMessage.audio)}>
      <Icon
        name={'play'}
        style={{
          marginLeft: 10,
          fontSize: 25,
          color: props.playAudio ? 'red' : 'blue',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: 13,
    height: 30,
    //margin: 3,
    width: 110,
    //backgroundColor: 'red',
    justifyContent: 'center',
  },
});

const renderBubble = (props: any) => {
  return <Bubble {...props} />;
};

export {renderBubble, RenderAudio};
