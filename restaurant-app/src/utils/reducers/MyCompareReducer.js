const MyCompareReducer = (currentState, action) => {
    switch (action.type) {
        case "ADD_TO_COMPARE":
            const exists = currentState.find((d) => d.id === action.payload.id);
            if (exists) {
                return currentState;
            }
            if (currentState.length >= 3) {
                alert("Chỉ có thể so sánh tối đa 3 món ăn!");
                return currentState;
            }
            return [...currentState, action.payload];
            
        case "REMOVE_FROM_COMPARE":
            return currentState.filter((d) => d.id !== action.payload);
            
        case "CLEAR_COMPARE":
            return [];
            
        default:
            return currentState;
    }
};

export default MyCompareReducer;
