export const SET_USER = "SET_USER";
export const SET_NEW_TOKEN = "SET_NEW_TOKEN";

export function setUser(userInfo) {
  return {
    type: SET_USER,
    payload: userInfo
  };
}

export function setNewToken(newToken) {
  return {
    type: SET_NEW_TOKEN,
    payload: newToken
  };
}
