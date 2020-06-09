/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from 'native-base';
import {Dimensions, TouchableOpacity} from 'react-native';

const RenderMicroPhone = (props: any) => {
  return (
    <TouchableOpacity
      style={{alignItems: 'center', margin: 10, justifyContent: 'center'}}
      onPress={props.handleAudio}>
      <Icon
        name="mic"
        size={35}
        hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
        style={{
          // bottom: 50,
          // right: Dimensions.get('window').width / 2,
          // position: 'absolute',
          // shadowColor: '#000',
          // shadowOffset: {width: 0, height: 0},
          // shadowOpacity: 0.5,
          // zIndex: 2,
          color: props.startAudio ? 'red' : 'black',
          backgroundColor: 'transparent',
        }}
      />
    </TouchableOpacity>
  );
};
export default RenderMicroPhone;
