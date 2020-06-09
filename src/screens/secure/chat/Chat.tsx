/* eslint-disable no-bitwise */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Container,
  Header,
  Body,
  Title,
  Left,
  Right,
  View,
  Text,
  Icon,
} from 'native-base';
import {GiftedChat, Actions, Send} from 'react-native-gifted-chat';
import {renderBubble, RenderAudio} from '../../../components/chat/RenderBubble';
import RenderMicroPhone from '../.././../components/chat/RenderMicroPhone';
import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import {docStorage} from './Chat.action';
import {uuid} from 'uuidv4';
import RenderVideo from '../../../components/chat/RenderVideo';
import ImagePicker from 'react-native-image-crop-picker';

const ChatScreen: React.FC = () => {
  const messageIdGenerator = () => {
    // generates uuid.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const [messages, setMessages] = useState([]);
  const [startAudio, setStartAudio] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioPath, setAudioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/${new Date().getTime()}.aac`,
  );
  const [playAudio, setPlayAudio] = useState(false);

  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [canEditText, setEditText] = useState(true);

  const [audioSettings, setAudioSettings] = useState({
    SampleRate: 22050,
    Channels: 1,
    AudioQuality: 'Low',
    AudioEncoding: 'aac',
    MeteringEnabled: true,
    IncludeBase64: true,
    AudioEncodingBitRate: 32000,
  });

  useEffect(() => {
    checkPermission().then(async isPermission => {
      setHasPermission(isPermission);
      if (!isPermission) {
        return;
      }
      await prepareRecordingPath(audioPath);
      AudioRecorder.onProgress = (data: any) => {
        console.log(data, 'onProgress data');
      };
      AudioRecorder.onFinished = (data: any) => {
        console.log(data, 'on finish');
      };
    });
    const message: any = [
      {
        _id: 1,
        text: 'I am a React developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ];
    setMessages(message);
  }, []);

  const prepareRecordingPath = (path: any) => {
    AudioRecorder.prepareRecordingAtPath(path, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  };

  const checkPermission = () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }
    const rationale: any = {
      title: 'Microphone Permission',
      message:
        'AudioExample needs access to your microphone so you can record audio.',
    };
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      rationale,
    ).then((result: any) => {
      console.log('Permission result:', result);
      return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
    });
  };

  const onSend = (message: any) => {
    const updateMessge = GiftedChat.append(messages, message);
    setMessages(updateMessge);
    setIsMediaLoading(false);
    setEditText(true);
  };

  const handleAudioPress = async () => {
    if (!startAudio) {
      setStartAudio(true);
      await prepareRecordingPath(audioPath);
      await AudioRecorder.startRecording();
    } else {
      setStartAudio(false);
      await AudioRecorder.stopRecording();
      const fileName = `${new Date().getTime()}.aac`;
      const file = {
        uri: Platform.OS === 'ios' ? audioPath : `file://${audioPath}`,
        name: fileName,
        type: 'audio/aac',
      };
      console.log('file is', file);
      // const msg = getMessageObject('audio', file.uri, fileName);
      // onSend(msg);
      docStorage(file.uri).then(url => {
        const msg = getMessageObject('audio', url, fileName);
        onSend(msg);
      });
    }
  };

  const getMessageObject = (content: string, uri: any, fileName: any) => {
    const msg = {
      _id: uuid(),
      createdAt: new Date(),
      user: {
        _id: 1,
      },
      [content]: uri,
    };
    if (content === 'doc') {
      msg.fileName = fileName;
    }
    return [msg];
  };

  const onAudioPress = (audio: any) => {
    console.log('audio is', audio);
    setPlayAudio(true);
    const sound = new Sound(audio, Sound.MAIN_BUNDLE, (error: any) => {
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
    });
    sound.release();
  };

  const renderAudio = (props: any) => {
    return (
      <RenderAudio
        {...props}
        onAudioPress={onAudioPress}
        playAudio={playAudio}
      />
    );
  };

  const renderSend = (props: any) => {
    if (!props.text.trim()) {
      return (
        <RenderMicroPhone
          handleAudio={handleAudioPress}
          startAudio={startAudio}
        />
      );
    }
    return <Send {...props} />;
  };

  const imageOrVideoPicker = () => {
    ImagePicker.openPicker({})
      .then((result: any) => {
        console.log('result is', result);
        setIsMediaLoading(true);
        setEditText(false);
        docStorage(result.path)
          .then((uri: any) => {
            console.log('uri is', uri);
            const isVideo = result.mime.startsWith('video');
            const content = isVideo ? 'video' : 'image';
            const msg = getMessageObject(content, uri, null);
            onSend(msg);
          })
          .catch(() => {
            setIsMediaLoading(false);
            setEditText(true);
          });
      })
      .catch(() => {
        return null;
      });
  };

  const renderActions = (params: any) => {
    const options = {
      'Choose image/video': () => {
        imageOrVideoPicker();
      },
      Cancel: () => {}, // tslint:disable-line
    };
    return <Actions {...params} options={options} />;
  };

  return (
    <Container>
      <Header transparent={true}>
        <Left />
        <Left />
        <Left />
        <Left />
        <Body>
          <Title style={{color: '#000'}}>Chats</Title>
        </Body>
        <Right />
      </Header>
      <GiftedChat
        messages={messages}
        onSend={sms => onSend(sms)}
        //renderBubble={renderBubble}
        renderMessageAudio={renderAudio}
        renderMessageVideo={RenderVideo}
        renderSend={renderSend}
        renderActions={renderActions}
        user={{
          _id: 1,
        }}
        textInputProps={{
          editable: canEditText,
          placeholder: canEditText
            ? 'Type a message...'
            : isMediaLoading && 'Uploading media ...',
          selectTextOnFocus: canEditText,
        }}
      />
      <KeyboardAvoidingView />
    </Container>
  );
};
export default ChatScreen;
