import {
  OwnerState,
  OwnerType,
  GET_OWNER_NAME,
  GET_OWNER_NAME_SUCCESS,
  GET_OWNER_NAME_FAILURE,
  GET_OWNER_PROFILE_PICTURE,
  GET_OWNER_PROFILE_PICTURE_SUCCESS,
  GET_OWNER_PROFILE_PICTURE_FAILURE,
  CLEAR_OWNERS,
  GetOwnerNameAction,
  GetOwnerProfilePictureAction,
  ClearOwnersAction,
} from './types';

const initialState: OwnerState = {
  owners: undefined,
  isFetching: false,
}

const initialOwnerState: OwnerType = {
  displayNames: {},
  imageURLs: {},
}

function updateOwners(owner = initialOwnerState, action: GetOwnerNameAction | GetOwnerProfilePictureAction): OwnerType | undefined {
  switch (action.type) {
    case GET_OWNER_NAME_SUCCESS:
      if (owner.displayNames && action.index && action.ownerName) {
        owner.displayNames[action.index] = action.ownerName
      }
      return {
        ...owner,
        displayNames: owner.displayNames
      }
    case GET_OWNER_PROFILE_PICTURE_SUCCESS:
      if (owner.imageURLs && action.index && action.ownerImageURL) {
        owner.imageURLs[action.index] = action.ownerImageURL
      }
      return {
        ...owner,
        imageURLs: owner.imageURLs,
      }
    default:
      return owner;
  }
}

export function templateOwnerReducer(state = initialState, action: GetOwnerNameAction | GetOwnerProfilePictureAction | ClearOwnersAction): OwnerState {
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
        owners: updateOwners(state.owners, action),
      }
    case CLEAR_OWNERS:
      return {
        ...state,
        owners: undefined,
      }
    default:
      return state;
  }
}

