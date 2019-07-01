import { SET_SEARCH_INPUT } from "../actions/searchActions";

const INITIAL_STATE = {
  currentSearchInput: ""
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SEARCH_INPUT:
      return {
        ...state,
        currentSearchInput: action.payload
      };
    default:
      return state;
  }
};

export default searchReducer;
