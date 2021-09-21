const activeUserInfo = (state = {}, action) => {
  switch (action.type) {
    case "SETUSERINFO":
      return action.payload;
    default:
      return state;
  }
};

export default activeUserInfo;
