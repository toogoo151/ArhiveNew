const initData = {
    admins: [],
    loadErrorMsg: null,
};
const reducer = (state = initData, action) => {
    switch (action.type) {
        case "LOAD_ADMINS_SUCCESS":
            return {
                ...state,
                admins: action.admins,
            };
        case "LOAD_ADMINS_ERROR":
            return {
                ...state,
                loadErrorMsg: action.msg,
            };

        default:
            return state;
    }
};

export default reducer;
