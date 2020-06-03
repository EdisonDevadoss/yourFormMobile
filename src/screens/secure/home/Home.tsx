import React from 'react';
import {
  Text,
  Container,
  Header,
  Content,
  List,
  ListItem,
  Body,
  Title,
  Left,
  Right,
} from 'native-base';

const HomeScreen: React.FC = (props: any) => {
  return (
    <Container>
      <Header transparent={true}>
        <Left />
        <Left />
        <Left />
        <Left />
        <Body>
          <Title style={{color: '#000'}}>List</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <List>
          <ListItem onPress={() => props.navigation.navigate('ChatScreen')}>
            <Text>9043487398</Text>
          </ListItem>
          <ListItem>
            <Text>9500103007</Text>
          </ListItem>
          <ListItem>
            <Text>8608660234</Text>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
};
export default HomeScreen;
