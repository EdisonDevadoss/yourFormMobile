/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from 'native-base';
import {Dimensions} from 'react-native';

const RenderMicroPhone = (props: any) => {
  console.log('props.startAudio is', props.startAudio)
  return (
    <Icon
      name="mic"
      size={35}
      hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
      //color={props.startAudio ? 'red' : 'black'}
      style={{
        bottom: 50,
        right: Dimensions.get('window').width / 2,
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        zIndex: 2,
        color: props.startAudio ? 'red' : 'black',
        backgroundColor: 'transparent',
      }}
      onPress={props.handleAudio}
    />
  );
};
export default RenderMicroPhone;
