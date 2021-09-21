function setActiveUser(str) {
  return { type: "SETUSER", payload: str };
}

export default setActiveUser;
