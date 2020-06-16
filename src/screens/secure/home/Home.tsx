/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
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
import {map, values} from 'lodash';
import {connect} from 'react-redux';
import {getConversations} from './Home.action';
import {FlatList} from 'react-native';

const HomeScreen: React.FC = (props: any) => {
  const {pagination, conversation} = props;
  console.log('pagination', pagination);

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

  useEffect(() => {
    const params = {
      perPage: pagination.perPage,
      page: pagination.currentPage,
    };
    props.dispatch(getConversations(params));
  }, []);

  const onLoadData = () => {
    if (!pagination.isLastPage) {
      const params = {
        perPage: pagination.perPage,
        page: pagination.currentPage + 1,
      };
      props.dispatch(getConversations(params));
    }
  };


  console.log('conversation is', conversation);

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
          <FlatList
            data={values(conversation)}
            renderItem={({item}: any) => {
              console.log('item is', item);
              return (
                <ListItem
                  onPress={() =>
                    props.navigation.navigate('ChatScreen', {chatDetail: item})
                  }>
                  <Body>
                    <Text>{item.mobile_no}</Text>
                    <Text>{item.status}</Text>
                  </Body>
                </ListItem>
              );
            }}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={() => onLoadData}
          />
          {/* {map(sampleList, (list: any, index: any) => {
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
          })} */}
        </List>
      </Content>
    </Container>
  );
};
function mapStateToProps(state: any): any {
  return {
    conversation: state.conversation.data,
    pagination: state.conversation.pagination,
  };
}

export default connect(mapStateToProps)(HomeScreen);
