const initialState = {
    headerMenu: [],
    subMenus: [],
    sideMenu: [],
    headerMenuError: null,
    subMenuError: null,
    sideMenuError: null,
    loading: false,
    newSuccessMsg: null,
    newErrMsg: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_HEADER_MENU_SUCCESS":
            return {
                ...state,
                headerMenu: action.headerMenu,
            };
        case "LOAD_HEADER_MENU_ERROR":
            return {
                ...state,
                headerMenuError: action.err,
            };
        case "LOAD_SUB_MENU_SUCCESS":
            return {
                ...state,
                subMenus: action.subMenus,
            };
        case "LOAD_SUB_MENU_ERROR":
            return {
                ...state,
                subMenuError: action.err,
            };
        case "LOAD_SIDE_MENU_SUCCESS":
            return {
                ...state,
                sideMenu: action.sideMenu,
            };
        case "LOAD_SIDE_MENU_ERROR":
            return {
                ...state,
                sideMenuError: action.err,
            };
        case "START_NEW_SUB_MENU":
            return {
                ...state,
                loading: true,
            };
        case "SUCCESS_NEW_SUB_MENU":
            return {
                ...state,
                newSuccessMsg: action.msg,
                loading: false,
            };
        case "ERROR_NEW_SUB_MENU":
            return {
                ...state,
                newErrMsg: action.msg,
                loading: false,
            };
        default:
            return state;
    }
};

export default reducer;
