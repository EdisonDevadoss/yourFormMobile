import {
  fetchConversationStart,
  fetchConversationSuccess,
  fetchConversationEnd,
} from '../../../redux/actions';
import {Dispatch} from 'redux';
import {http} from '../../../lib/http';

export const getConversations = (params: any) => {
  return (dispatch: Dispatch): Promise<any> =>
    new Promise((resolve, reject) => {
      dispatch(fetchConversationStart());
      http
        .get('v1/conversations', {params})
        .then(response => {
          console.log('response is', response);
          resolve(response);
          dispatch(fetchConversationSuccess(response));
        })
        .catch(error => {
          reject(error);
          dispatch(fetchConversationEnd());
        });
    });
};
