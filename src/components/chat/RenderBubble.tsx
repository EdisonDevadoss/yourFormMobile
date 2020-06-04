/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Icon} from 'native-base';
import {Bubble} from 'react-native-gifted-chat';

const renderAudio = (props: any) => {
  return !props.currentMessage.audio ? (
    <View />
  ) : (
    <Icon
      name="play"
      style={{
        left: 90,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        backgroundColor: 'transparent',
      }}
      onPress={props.onAudioPress}
    />
  );
};

const renderBubble = (props: any) => {
  return (
    <View>
      {renderAudio(props)}
      <Bubble {...props} />
    </View>
  );
};

export default renderBubble;
