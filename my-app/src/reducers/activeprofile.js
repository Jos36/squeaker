const activeProfile = (state = {}, action) => {
  switch (action.type) {
    case "SETPROFILE":
      return action.payload;
    default:
      return state;
  }
};

export default activeProfile;
