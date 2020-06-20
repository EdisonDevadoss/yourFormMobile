/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Icon} from 'native-base';
import {Bubble, InputToolbar} from 'react-native-gifted-chat';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Sound from 'react-native-sound';

const RenderAudio = (props: any) => {
  const [playAudio, setPlayAudio] = useState(false);

  const onPlayAudio = () => {
    setPlayAudio(true);
    // props.onAudioPress(props.currentMessage.audio);
    // setPlayAudio(false);
    const sound = new Sound(
      props.currentMessage.audio,
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
        setPlayAudio(false);
        sound.play(success => {
          console.log(success, 'success play');
          sound.release();
          if (!success) {
            Alert.alert('There was an error playing this audio');
          }
        });
      },
    );
    sound.release();
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
