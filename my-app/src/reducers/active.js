const activeReducer = (state = {}, action) => {
  switch (action.type) {
    case "SETACTIVE":
      return action.payload;
    default:
      return state;
  }
};
export default activeReducer;
