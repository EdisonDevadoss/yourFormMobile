/* eslint-disable no-bitwise */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Container, Header, Body, Title, Left, Right} from 'native-base';
import {GiftedChat} from 'react-native-gifted-chat';
import RenderBubble from '../../../components/chat/RenderBubble';
import RenderMicroPhone from '../.././../components/chat/RenderMicroPhone';
import {KeyboardAvoidingView, Platform, PermissionsAndroid} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {docStorage} from './Chat.action';
import {uuid} from 'uuidv4';

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
    `${AudioUtils.DocumentDirectoryPath}/${messageIdGenerator()}test.aac`,
  );
  const [playAudio, setPlayAudio] = useState(false);
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
      await AudioRecorder.prepareRecordingAtPath(audioPath, audioSettings);
      AudioRecorder.onProgress = (data: any) => {
        console.log(data, 'onProgress data');
      };
      AudioRecorder.onFinished = (data: any) => {
        console.log(data, 'on finish');
      };
    });
    const message: any = {
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    };
    setMessages([message]);
  }, [audioPath, audioSettings]);

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
  };

  const handleAudioPress = async () => {
    if (!startAudio) {
      setStartAudio(true);
      await AudioRecorder.startRecording();
    } else {
      setStartAudio(false);
      await AudioRecorder.stopRecording();
      const fileName = `${messageIdGenerator()}.aac`;
      const file = {
        uri: Platform.OS === 'ios' ? audioPath : `file://${audioPath}`,
        name: fileName,
        type: 'audio/aac',
      };
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
        _id: 2,
      },
      [content]: uri,
    };
    if (content === 'doc') {
      msg.fileName = fileName;
    }
    return [msg];
  };

  const renderBubble = (props: any) => {
    return <RenderBubble {...props} />;
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
      <RenderMicroPhone
        handleAudio={handleAudioPress}
        startAudio={startAudio}
      />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        renderBubble={renderBubble}
        user={{
          _id: 1,
        }}
      />
      <KeyboardAvoidingView />
    </Container>
  );
};
export default ChatScreen;
