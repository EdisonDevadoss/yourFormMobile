/* eslint-disable react-hooks/exhaustive-deps */
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
import {documentUpload, getDocument} from '../../../lib/docUpload';
import renderCustomView from '../../../components/chat/RenderCustomView';

const ChatScreen: React.FC = (props: any) => {
  const [messages, setMessages] = useState([]);
  const [startAudio, setStartAudio] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioPath, setAudioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/${new Date().getTime()}.aac`,
  );
  const [playAudio, setPlayAudio] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const {chatDetail} = props.route.params;

  console.log('chatDetail is', chatDetail);

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
        text:
          'கீழே உள்ள விருப்பங்களிலிருந்து ஒரு எண்ணைத் தட்டச்சு செய்க 1. சிகிச்சை (Treatment/வைத்தியம்) 2. பராமரிப்பு ஆலோசனை (தீவனம் சம்பந்தமாக கன்று வளர்ப்பு இனப்பெருக்கம் தடுப்பூசி இதர)',
        createdAt: '2020-06-10T06:13:25.704Z',
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

  const renderAudio = (audioProps: any) => {
    return (
      <RenderAudio
        {...audioProps}
        onAudioPress={onAudioPress}
        playAudio={playAudio}
      />
    );
  };

  const renderSend = (senProps: any) => {
    if (!senProps.text.trim()) {
      return (
        <RenderMicroPhone
          handleAudio={handleAudioPress}
          startAudio={startAudio}
        />
      );
    }
    return <Send {...senProps} />;
  };

  const imageOrVideoPicker = () => {
    ImagePicker.openPicker({})
      .then((result: any) => {
        console.log('result is', result);
        setIsMediaLoading(true);
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
          });
      })
      .catch(() => {
        return null;
      });
  };

  const documentPikcer = async () => {
    try {
      const doc: any = await getDocument();
      setIsMediaLoading(true);
      const url = await documentUpload(doc.path);
      const msg = getMessageObject('doc', url, doc.fileName);
      onSend(msg);
    } catch (error) {
      setIsMediaLoading(false);
      if (error === 'cancelled') {
        return null;
      } else {
        // errorToast('Failed to upload. Please select valid document');
        return null;
      }
    }
  };

  const renderActions = (params: any) => {
    const options = {
      'Choose image/video': () => {
        imageOrVideoPicker();
      },
      'Choose document': () => {
        documentPikcer();
      },
      Cancel: () => {}, // tslint:disable-line
    };
    return <Actions {...params} options={options} />;
  };

  console.log('messages is', JSON.stringify(messages));
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
        renderCustomView={renderCustomView}
        renderSend={renderSend}
        renderActions={renderActions}
        user={{
          _id: 1,
        }}
        textInputProps={{
          editable: !isMediaLoading,
          placeholder: !isMediaLoading
            ? 'Type a message...'
            : 'Uploading media ...',
          selectTextOnFocus: !isMediaLoading,
        }}
      />
      <KeyboardAvoidingView />
    </Container>
  );
};
export default ChatScreen;
