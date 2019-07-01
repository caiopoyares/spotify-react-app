export const SET_SEARCH_INPUT = "SET_SEARCH_INPUT";

export const setSearchInput = input => {
  return {
    type: SET_SEARCH_INPUT,
    payload: input
  };
};
