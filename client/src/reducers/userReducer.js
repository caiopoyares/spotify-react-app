import { SET_USER, SET_NEW_TOKEN } from "../actions/userActions";

export default function userReducer(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload
      };
    case SET_NEW_TOKEN:
      return {
        ...state,
        access_token: action.payload
      };
    default:
      return state;
  }
}
