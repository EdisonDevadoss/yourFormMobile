import {
  FETCH_CONVERSATIONS_STARTED,
  FETCH_CONVERSATIONS_ERROR,
  FETCH_CONVERSATIONS_COMPLETED,
} from '../../actionTypes';

export const fetchConversationStart = () => ({
  type: FETCH_CONVERSATIONS_STARTED,
});

export const fetchConversationSuccess = (data: any) => ({
  payload: data,
  type: FETCH_CONVERSATIONS_COMPLETED,
});

export const fetchConversationEnd = () => ({
  type: FETCH_CONVERSATIONS_ERROR,
});
