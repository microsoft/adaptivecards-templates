export interface PageState {
  currentPageTitle?: string;
  currentPage?: string;
  modalState?: ModalState;
  previousPage?: string;
}

export enum ModalState {
  Share,
  ShareSuccess,
  Publish,
  Unpublish,
  Version,
  EditName,
  Delete,
  Save,
  Spinner,
  SaveAndPublish
}

// Action Types
export const NAVIGATION = "NAVIGATION";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";

// Actions
export interface PageAction {
  type: typeof NAVIGATION | typeof OPEN_MODAL | typeof CLOSE_MODAL;
  text: string;
  currentPageTitle?: string;
  currentPage?: string;
  lastPage?: string;
  modalState?: ModalState;
}
