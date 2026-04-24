const MyOrderReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem)
        return state.map((item) =>
          item.id === action.payload.id
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      return [...state, {...action.payload, quantity: 1}];
    case "UPDATE_TO_CART":
      return state.map((item) =>
        item.id === action.payload.id
          ? {...item, quantity: action.payload.quantity}
          : item,
      );
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export default MyOrderReducer;
