const initData = {
    headerMenus: [],
    startLoadHeaderMenu: false,
    errorLoadHeaderMenu: null,
};

const reducer = (state = initData, action) => {
    switch (action.type) {
        case "START_LOAD_HEADER_MENU":
            return {
                ...state,
                startLoadHeaderMenu: true,
            };
        case "SUCCESS_LOAD_HEADER_MENU":
            return {
                ...state,
                headerMenus: action.headers,
                startLoadHeaderMenu: false,
            };
        case "ERROR_LOAD_HEADER_MENU":
            return {
                ...state,
                errorLoadHeaderMenu: action.err,
                startLoadHeaderMenu: false,
            };
        default:
            return state;
    }
};

export default reducer;
