const profilePosts = (state = "loading", action) => {
  switch (action.type) {
    case "SETPROFILEPOSTS":
      return action.payload;
    default:
      return state;
  }
};
export default profilePosts;
