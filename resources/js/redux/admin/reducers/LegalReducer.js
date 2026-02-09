const initialState = {
    legals: [],
    loadLegalError: null,
    newLoading: false,
    newSuccessMsg: null,
    newErrorMsg: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_LEGAL_SUCCESS":
            return {
                ...state,
                legals: action.legals,
            };
        case "LOAD_LEGAL_ERROR":
            return {
                ...state,
                loadLegalError: action.msg,
            };
        case "NEW_LEGAL_START":
            return {
                ...state,
                newLoading: true,
            };
        case "NEW_LEGAL_SUCCESS":
            return {
                ...state,
                newLoading: false,
                newSuccessMsg: action.msg,
            };
        case "NEW_LEGAL_ERROR":
            return {
                ...state,
                newLoading: false,
                newErrorMsg: action.msg,
            };

        default:
            return state;
    }
};

export default reducer;
