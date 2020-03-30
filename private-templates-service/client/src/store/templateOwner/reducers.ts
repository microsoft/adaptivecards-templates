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
  owners: undefined,
  isFetchingName: false,
  isFetchingPicture: false,
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

function clearOwners(owner = initialOwnerState, action: GetOwnerNameAction | GetOwnerProfilePictureAction): OwnerType | undefined {
  switch (action.type) {
    case GET_OWNER_NAME:
      return {
        ...owner,
        displayNames: {}
      }
    case GET_OWNER_PROFILE_PICTURE:
      return {
        ...owner,
        imageURLs: {},
      }
    default:
      return owner;
  }
}

export function templateOwnerReducer(state = initialState, action: GetOwnerNameAction | GetOwnerProfilePictureAction): OwnerState {
  switch (action.type) {
    case GET_OWNER_NAME:
      return {
        ...state,
        owners: clearOwners(state.owners, action),
        isFetchingName: true,
      };
    case GET_OWNER_PROFILE_PICTURE:
      return {
        ...state,
        owners: clearOwners(state.owners, action),
        isFetchingPicture: true,
      };
    case GET_OWNER_NAME_FAILURE:
      return {
        ...state,
        isFetchingName: false,
      }
    case GET_OWNER_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        isFetchingPicture: false,
      }
    case GET_OWNER_NAME_SUCCESS:
      return {
        ...state,
        owners: updateOwners(state.owners, action),
        isFetchingName: false,
      }
    case GET_OWNER_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        owners: updateOwners(state.owners, action),
        isFetchingPicture: false,
      }
    default:
      return state;
  }
}

