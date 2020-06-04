/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Container, Header, Body, Title, Left, Right} from 'native-base';
import {GiftedChat} from 'react-native-gifted-chat';
import RenderBubble from '../../../components/chat/RenderBubble';
import RenderMicroPhone from '../.././../components/chat/RenderMicroPhone';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
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
  }, []);

  const onSend = (message: any) => {
    const updateMessge = GiftedChat.append(messages, message);
    setMessages(updateMessge);
  };

  const onAudioPress = () => {
    console.log('onAudioPress is called');
  };

  const renderBubble = (props: any) => {
    return <RenderBubble {...props} onAudioPress={onAudioPress} />;
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
      <RenderMicroPhone />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        renderBubble={renderBubble}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
};
export default ChatScreen;
