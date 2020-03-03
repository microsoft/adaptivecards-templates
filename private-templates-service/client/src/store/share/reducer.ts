import { ShareTemplateState, REQUEST_SEND_EMAIL, RECEIVE_SEND_EMAIL, FAILURE_SEND_EMAIL, ShareTemplateAction } from './types';

const initialState: ShareTemplateState = {
  isFetching: false
};

export function shareTemplateReducer(state = initialState, action: ShareTemplateAction): ShareTemplateState {
  switch (action.type) {
    case REQUEST_SEND_EMAIL:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_SEND_EMAIL:
      return {
        ...state,
        isFetching: false
      };
    case FAILURE_SEND_EMAIL:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}