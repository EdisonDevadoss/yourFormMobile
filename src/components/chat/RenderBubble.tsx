/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Icon} from 'native-base';
import {Bubble, InputToolbar} from 'react-native-gifted-chat';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Sound from 'react-native-sound';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

const RenderAudio = (props: any) => {
  const [playAudio, setPlayAudio] = useState(false);

  const playbackState = usePlaybackState();

  useEffect(() => {
    setup();
  }, []);

  // useEffect(() => {
  //   if (playbackState === TrackPlayer.STATE_PLAYING) {
  //     setPlayAudio(true);
  //   } else {
  //     setPlayAudio(false);
  //   }
  //   //STATE_STOPPED
  // }, [playbackState]);

  async function setup() {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });
  }

  const onPlayAudio = async () => {
    setPlayAudio(true);
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log('currentTrack is', currentTrack, playbackState);
    if (
      currentTrack == null ||
      (currentTrack == 'local-track' &&
        playbackState !== 3 &&
        playbackState !== 2)
    ) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'local-track',
        url: props.currentMessage.audio,
        //title: 'Pure (Demo)',
        //artist: 'David Chavez',
        artwork: 'https://i.picsum.photos/id/500/200/200.jpg',
        //duration: 28,
      });
      await TrackPlayer.play();
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
    setPlayAudio(false);

  };

  return (
    <TouchableOpacity style={styles.audioStyle} onPress={onPlayAudio}>
      <Icon
        name={playAudio ? 'pause' : 'play'}
        style={{
          marginLeft: 10,
          fontSize: 25,
          color: playAudio ? 'red' : 'black',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioStyle: {
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

const renderInputToolbar = (inputProps: any) => {
  return (
    <InputToolbar
      {...inputProps}
      icon={() => {
        return (
          <Icon name="attachment" type="Entypo" style={{color: '#b2b2b2'}} />
        );
      }}
    />
  );
};

export {renderBubble, RenderAudio, renderInputToolbar};
