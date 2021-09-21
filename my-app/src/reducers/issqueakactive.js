const isSqueakActive = (state = {}, action) => {
  switch (action.type) {
    case "SETISSQUEAK":
      return action.payload;
    default:
      return state;
  }
};
export default isSqueakActive;
