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
  Toast,
  Root,
} from 'native-base';
import {GiftedChat, Actions, Send} from 'react-native-gifted-chat';
import {
  renderBubble,
  RenderAudio,
  renderInputToolbar,
} from '../../../components/chat/RenderBubble';
import RenderMicroPhone from '../.././../components/chat/RenderMicroPhone';
import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import {docStorage, sendMessage, getAConversations} from './Chat.action';
import {uuid} from 'uuidv4';
import RenderVideo from '../../../components/chat/RenderVideo';
import ImagePicker from 'react-native-image-crop-picker';
import {documentUpload, getDocument} from '../../../lib/docUpload';
import renderCustomView from '../../../components/chat/RenderCustomView';
import {isValidFileSize} from '../../../lib/fileUploadSize';
// import {env} from '../../../config';
// import ws from './socket';

const ChatScreen: React.FC = (props: any) => {
  const {chatDetail} = props.route.params;
  // const [ws, setWs] = useState(
  //   new WebSocket('ws://chatbot-api.herokuapp.com/'),
  // );

  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState([...chatDetail.message]);
  console.log('messages is', messages);
  const [startAudio, setStartAudio] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioPath, setAudioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/${new Date().getTime()}.aac`,
  );
  const [playAudio, setPlayAudio] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  useEffect(() => {
    getAConversations(chatDetail.id).then((res: any) => {
      console.log('res is', res);
      setMessages(res.message);
    });
  }, []);

  useEffect(() => {
    // console.log('useEffect is called')
    // eslint-disable-next-line no-undef
    const ws = new WebSocket('ws://chatbot-api.herokuapp.com');
    console.log('ws', ws);
    ws.onopen = () => {
      console.log('WebSocket Client Connected', ws.readyState);
    };
    ws.onmessage = msg => {
      console.log('msg is', msg.data);
      const parse = JSON.parse(msg.data);
      console.log('parse', parse);
      setMessages([...parse.message]);
    };
    ws.onclose = err => {
      console.log('err', err);
      console.log(ws.readyState, 'onclose');
    };
    ws.onerror = err => {
      console.log('err', err);
      console.log(ws.readyState, 'onerror');
      // setWs(new WebSocket('ws://chatbot-api.herokuapp.com/'));
    };
    // console.log(ws.readyState, 'readyState');

    return () => ws.close();
  }, []);


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
    // const message: any = [
    //   {
    //     _id: 1,
    //     audio:
    //       'https://s3-external-1.amazonaws.com/media.twiliocdn.com/ACe2d2cdcbd263af1f20ad9c73aba8708b/7c84c9fa884b794f28e15784fb34911e',
    //     createdAt: '2020-06-10T06:13:25.704Z',
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //     },
    //   },
    // ];
    // setMessages(message);

    // // setMessages(chatDetail.message);
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
    const updateMessge = GiftedChat.append(message, messages);
    console.log('updateMessge is', updateMessge);
    setMessages(updateMessge);
    sendMessage(chatDetail.id, message);
    setIsMediaLoading(false);
  };

  const handleAudioPress = async () => {
    if (!startAudio) {
      setStartAudio(true);
      await prepareRecordingPath(audioPath);
      await AudioRecorder.startRecording();
    } else {
      setStartAudio(false);
      setIsMediaLoading(true);
      await AudioRecorder.stopRecording();
      const fileName = `${new Date().getTime()}.aac`;
      const file = {
        uri: Platform.OS === 'ios' ? audioPath : `file://${audioPath}`,
        name: fileName,
        type: 'audio/aac',
      };
      docStorage(file.uri).then(url => {
        // const audioUrl = `${url}.mp3`;
        console.log('url is', url);
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
    // if (!senProps.text.trim() && !isMediaLoading) {
    //   return (
    //     <RenderMicroPhone
    //       handleAudio={handleAudioPress}
    //       startAudio={startAudio}
    //     />
    //   );
    // }
    return <Send {...senProps} />;
  };

  const imageOrVideoPicker = () => {
    ImagePicker.openPicker({})
      .then((result: any) => {
        console.log('result is', result);
        console.log('is valid', isValidFileSize(result.size));
        if (isValidFileSize(result.size)) {
          setIsMediaLoading(true);
          docStorage(result.path)
            .then((uri: any) => {
              console.log('uri is', uri);
              const isVideo = result.mime.startsWith('video');
              const content = isVideo ? 'video' : 'image';
              // const validUrl = isVideo ? `${uri}.mp4` : uri;
              const msg = getMessageObject(content, uri, null);
              console.log('msg is', msg);
              onSend(msg);
            })
            .catch(() => {
              setIsMediaLoading(false);
            });
        } else {
          Toast.show({text: 'File size should not be greater than 4MB'});
        }
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

  return (
    <Root>
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
          // renderBubble={renderBubble}
          renderMessageAudio={renderAudio}
          renderMessageVideo={RenderVideo}
          renderCustomView={renderCustomView}
          //renderSend={renderSend}
          renderActions={!isMediaLoading ? renderActions : null}
          renderInputToolbar={renderInputToolbar}
          user={{
            _id: 1,
            name: 'admin',
          }}
          textInputProps={{
            editable: !isMediaLoading,
            placeholder: !isMediaLoading
              ? 'Type a message...'
              : 'Uploading media ...',
            selectTextOnFocus: !isMediaLoading,
          }}
          inverted={false}
        />
        <KeyboardAvoidingView />
      </Container>
    </Root>
  );
};
export default ChatScreen;
