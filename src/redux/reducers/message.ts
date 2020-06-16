import {
  FETCH_MESSAGES_STARTED,
  FETCH_MESSAGES_ERROR,
  FETCH_MESSAGES_COMPLETED,
} from '../actionTypes';

const INITIAL_STATE: any = {
  data: {},
  error: false,
  submitted: false,
};

function messageReducer(state = INITIAL_STATE, action: any): any {
  switch (action.type) {
    case FETCH_MESSAGES_STARTED: {
      return {
        ...state,
        submitted: true,
      };
    }
    case FETCH_MESSAGES_COMPLETED: {
      return {
        ...state,
        data: {...state.data, ...action.payload},
        submitted: false,
      };
    }
    case FETCH_MESSAGES_ERROR: {
      return {
        ...state,
        error: true,
        submitted: false,
      };
    }
    default:
      return state;
  }
}

export default messageReducer;
