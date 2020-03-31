export interface OwnerState {
  owners?: OwnerType;
  isFetchingName: boolean;
  isFetchingPicture: boolean;
}

export interface OwnerType {
  displayNames?: { [index: string]: string; };
  imageURLs?: { [index: string]: string; };
}

export const GET_OWNER_NAME = 'GET_OWNER_NAME';
export const GET_OWNER_NAME_SUCCESS = 'GET_OWNER_NAME_SUCCESS';
export const GET_OWNER_NAME_FAILURE = 'GET_OWNER_NAME_FAILURE';

export const GET_OWNER_PROFILE_PICTURE = 'GET_OWNER_PROFILE_PICTURE';
export const GET_OWNER_PROFILE_PICTURE_SUCCESS = 'GET_OWNER_PROFILE_PICTURE_SUCCESS';
export const GET_OWNER_PROFILE_PICTURE_FAILURE = 'GET_OWNER_PROFILE_PICTURE_FAILURE';

export const CLEAR_OWNERS = 'CLEAR_OWNERS';

export interface GetOwnerNameAction {
  type: typeof GET_OWNER_NAME | typeof GET_OWNER_NAME_SUCCESS | typeof GET_OWNER_NAME_FAILURE;
  index?: string;
  ownerName?: string;
}

export interface GetOwnerProfilePictureAction {
  type: typeof GET_OWNER_PROFILE_PICTURE | typeof GET_OWNER_PROFILE_PICTURE_SUCCESS | typeof GET_OWNER_PROFILE_PICTURE_FAILURE;
  index?: string;
  ownerImageURL?: string;
}