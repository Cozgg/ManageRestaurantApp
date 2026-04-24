import {createContext, useEffect, useReducer} from "react";
import MyOrderReducer from "../reducers/MyOrderReducer";

export const MyOrderContext = createContext();

export const MyOrderProvider = ({children}) => {
  const [cart, dispatch] = useReducer(MyOrderReducer, [], () => {
    const data = localStorage.getItem("data");
    try {
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(cart));
  }, [cart]);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <MyOrderContext.Provider value={{cart, dispatch, totalQuantity}}>
      {children}
    </MyOrderContext.Provider>
  );
};
