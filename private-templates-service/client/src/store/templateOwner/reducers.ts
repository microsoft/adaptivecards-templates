import {
  OwnerState,
  OwnerType,
  GET_OWNER_NAME,
  GET_OWNER_NAME_SUCCESS,
  GET_OWNER_NAME_FAILURE,
  GET_OWNER_PROFILE_PICTURE,
  GET_OWNER_PROFILE_PICTURE_SUCCESS,
  GET_OWNER_PROFILE_PICTURE_FAILURE,
  GetOwnerNameAction,
  GetOwnerProfilePictureAction,
} from './types';

const initialState: OwnerState = {
  owner: undefined,
  isFetching: false,
}

const initialOwnerState: OwnerType = {
  displayName: "",
}

function createOwner(owner = initialOwnerState, action: GetOwnerNameAction | GetOwnerProfilePictureAction): OwnerType | undefined {
  switch (action.type) {
    case GET_OWNER_NAME_SUCCESS:
      return {
        ...owner,
        displayName: action.ownerName
      }
    case GET_OWNER_PROFILE_PICTURE_SUCCESS:
      return {
        ...owner,
        imageURL: action.ownerImageURL,
      }
    default:
      return owner;
  }
}

export function templateOwnerReducer(state = initialState, action: GetOwnerNameAction | GetOwnerProfilePictureAction): OwnerState {
  switch (action.type) {
    // empty case statement will "fall through" to logic in the next non-empty case
    case GET_OWNER_NAME:
    case GET_OWNER_PROFILE_PICTURE:
      return {
        ...state,
        isFetching: true,
      };
    case GET_OWNER_NAME_FAILURE:
    case GET_OWNER_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case GET_OWNER_NAME_SUCCESS:
    case GET_OWNER_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        owner: createOwner(state.owner, action),
      }
    default:
      return state;
  }
}

