export interface OwnerState {
  owner?: OwnerType;
  isFetching: boolean;
}

export interface OwnerType {
  displayName?: string;
  imageURL?: string;
}

export const GET_OWNER_NAME = 'GET_OWNER_NAME';
export const GET_OWNER_NAME_SUCCESS = 'GET_OWNER_NAME_SUCCESS';
export const GET_OWNER_NAME_FAILURE = 'GET_OWNER_NAME_FAILURE';

export const GET_OWNER_PROFILE_PICTURE = 'GET_OWNER_PROFILE_PICTURE';
export const GET_OWNER_PROFILE_PICTURE_SUCCESS = 'GET_OWNER_PROFILE_PICTURE_SUCCESS';
export const GET_OWNER_PROFILE_PICTURE_FAILURE = 'GET_OWNER_PROFILE_PICTURE_FAILURE';

export interface GetOwnerNameAction {
  type: typeof GET_OWNER_NAME | typeof GET_OWNER_NAME_SUCCESS | typeof GET_OWNER_NAME_FAILURE;
  ownerName?: string;
}

export interface GetOwnerProfilePictureAction {
  type: typeof GET_OWNER_PROFILE_PICTURE | typeof GET_OWNER_PROFILE_PICTURE_SUCCESS | typeof GET_OWNER_PROFILE_PICTURE_FAILURE;
  ownerImageURL?: string;
}
