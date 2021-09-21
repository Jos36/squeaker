import { combineReducers } from "redux";
import loggedReducer from "./islogged";
import activeReducer from "./active";
import posts from "./posts";
import activeProfile from "./activeprofile";
import activeUser from "./activeuser";
import profilePosts from "./profileposts";
import isSqueakActive from "./issqueakactive";
import activeUserInfo from "./activeuserinfo";

const allReducers = combineReducers({
  loggedReducer,
  activeReducer,
  posts,
  activeProfile,
  activeUser,
  profilePosts,
  isSqueakActive,
  activeUserInfo,
});

export default allReducers;
