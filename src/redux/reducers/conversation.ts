import {
  FETCH_CONVERSATIONS_STARTED,
  FETCH_CONVERSATIONS_ERROR,
  FETCH_CONVERSATIONS_COMPLETED,
} from '../actionTypes';

const INITIAL_STATE: any = {
  data: {},
  pagination: {
    currentPage: 1,
    endAt: 0,
    isFirstPage: false,
    isLastPage: false,
    nextPage: null,
    perPage: 10,
    prevPage: null,
    startAt: 1,
    totalCount: 0,
    totalPages: 0,
  },
  error: false,
  submitted: false,
};

function conversationReducer(state = INITIAL_STATE, action: any): any {
  switch (action.type) {
    case FETCH_CONVERSATIONS_STARTED: {
      return {
        ...state,
        submitted: true,
      };
    }
    case FETCH_CONVERSATIONS_COMPLETED: {
      return {
        ...state,
        data: {...state.data, ...action.payload.conversations},
        pagination: {...action.payload.pagination},
        submitted: false,
      };
    }
    case FETCH_CONVERSATIONS_ERROR: {
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

export default conversationReducer;
