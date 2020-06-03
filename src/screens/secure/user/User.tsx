import React from 'react';
import {
  Container,
  Header,
  Content,
  Body,
  Title,
  Left,
  Right,
} from 'native-base';

const UserScreen: React.FC = () => {
  return (
    <Container>
      <Header transparent={true}>
        <Left />
        <Left />
        <Left />
        <Left />
        <Body>
          <Title style={{color: '#000'}}>User</Title>
        </Body>
        <Right />
      </Header>
      <Content />
    </Container>
  );
};
export default UserScreen;
