const MyUserReducer = (current, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return null;
  }
  //trả về data user
  return current;
};

export default MyUserReducer;
