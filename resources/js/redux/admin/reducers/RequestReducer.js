const initData = {
    requests: [],
    isSending: false,
    successMsg: null,
    errorMsg: null,
};

const reducer = (state = initData, action) => {
    switch (action.type) {
        case "LOAD_REQUESTS":
            return {
                ...state,
                requests: action.requests,
            };
        case "START_APPROVE_REQUEST":
            return {
                ...state,
                isSending: true,
            };
        case "SUCCESS_APPROVE_REQUEST":
            return {
                ...state,
                isSending: false,
                successMsg: action.msg,
                errorMsg: null,
            };
        case "ERROR_APPROVE_REQUEST":
            return {
                ...state,
                isSending: false,
                errorMsg: action.msg,
                successMsg: null,
            };

        default:
            return state;
    }
};

export default reducer;
