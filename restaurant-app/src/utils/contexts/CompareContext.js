import {createContext, useContext, useReducer} from "react";

const CompareContext = createContext();

const initialState = {
  compareList: [],
};

const CompareReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_COMPARE":
      const exists = state.compareList.find((d) => d.id === action.payload.id);
      if (exists) {
        return state;
      }
      if (state.compareList.length >= 3) {
        alert("Chỉ có thể so sánh tối đa 3 món ăn!");
        return state;
      }
      return {
        ...state,
        compareList: [...state.compareList, action.payload],
      };
    case "REMOVE_FROM_COMPARE":
      return {
        ...state,
        compareList: state.compareList.filter((d) => d.id !== action.payload),
      };
    case "CLEAR_COMPARE":
      return {
        ...state,
        compareList: [],
      };
    default:
      return state;
  }
};

export const CompareProvider = ({children}) => {
  const [state, dispatch] = useReducer(CompareReducer, initialState);

  return (
    <CompareContext.Provider value={{state, dispatch}}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  return useContext(CompareContext);
};
