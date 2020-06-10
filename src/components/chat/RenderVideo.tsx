/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'native-base';
import VideoPlayer from 'react-native-video-controls';

const RenderVideo = (props: any) => {
  return (
    <View style={{height: 180, borderRadius: 20, margin: 3}}>
      <VideoPlayer
        source={{uri: props.currentMessage.video}}
        toggleResizeModeOnFullscreen={false}
        showOnStart={false}
        disableFullscreen
        disableBack
        //style={{height: 30, width: 100}}
        //videoStyle={{borderRadius: 13, height: 100, margin: 3, width: 150}}
      />
    </View>
  );
};

export default RenderVideo;
