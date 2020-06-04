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
import {map} from 'lodash';

const HomeScreen: React.FC = (props: any) => {
  const sampleList: any = [
    {
      mobileNo: '9043487398',
      code: 56787,
    },
    {
      mobileNo: '9500103007',
      code: 7888,
    },
    {
      mobileNo: '8608660324',
      code: 9963,
    },
  ];
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
          {map(sampleList, (list: any, index: any) => {
            return (
              <ListItem
                key={index}
                onPress={() => props.navigation.navigate('ChatScreen')}>
                <Body>
                  <Text>{list.mobileNo}</Text>
                  <Text>{list.code}</Text>
                </Body>
              </ListItem>
            );
          })}
        </List>
      </Content>
    </Container>
  );
};
export default HomeScreen;
