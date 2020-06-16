import AsyncStorage from '@react-native-community/async-storage';
import {combineReducers} from 'redux';
import {reducer as reducerForm} from 'redux-form';
import conversationReducer from '../reducers/conversation';
import messageReducer from '../reducers/message';
import {CLEAR_ALL_DATA} from '../actionTypes';

const rootReducer = combineReducers({
  conversation: conversationReducer,
  message: messageReducer,
  form: reducerForm,
});

const appReducer = (state: any, action: any) => {
  if (action.type === CLEAR_ALL_DATA) {
    Object.keys(state).forEach(key => {
      AsyncStorage.removeItem(`persist:${key}`);
    });
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
