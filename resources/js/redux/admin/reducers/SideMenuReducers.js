const initialState = {
    headers: [],
    loadHeaderError: null,
    selectedHeaderMenuID: null,
    sideMenus: [],
    sideMenuError: null,

    newSideMenu: {
        sideMenus: [],
        headerMenuID: -1,
        sideMenuID: -1,
        sideMenuName: "",
    },

    editSideMenu: {
        headerMenuID: null,
        parentId: null,
        sideMenuId: null,
        sideMenuName: null,
        errorMsg: null,
        successMsg: null,
        loading: false,
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_HEADERS_SUCCESS":
            return {
                ...state,
                headers: action.headers,
            };
        case "LOAD_HEADERS_ERROR":
            return {
                ...state,
                loadHeaderError: action.error,
            };
        case "SET_SELECTED_HEADER_MENU_ID":
            return {
                ...state,
                selectedHeaderMenuID: action.selectedHeaderMenuID,
            };
        case "LOAD_SIDE_MENU_SUCCESS":
            return {
                ...state,
                sideMenus: action.sideMenus,
            };
        case "LOAD_SIDE_MENU_ERROR":
            return {
                ...state,
                sideMenuError: action.error,
            };
        case "SET_HEADER_MENU_ID":
            return {
                ...state,
                headerMenuID: action.headerMenuID,
            };
        case "FILL_EDIT_SIDE_MENU_DATA":
            return {
                ...state,
                editSideMenu: {
                    ...state.editSideMenu,
                    headerMenuID: action.headerMenuID,
                    parentId: action.parentId,
                    sideMenuId: action.sideMenuId,
                    sideMenuName: action.sideMenuName,
                },
            };
        case "LOAD_SIDE_MENU_ROW_SUCCESS":
            return {
                ...state,
                editSideMenu: {
                    ...state.editSideMenu,
                    headerMenuID: action.sideMenuRow.header_menu_id,
                    parentId: action.sideMenuRow.parent_id,
                    sideMenuId: action.sideMenuRow.id,
                    sideMenuName: action.sideMenuRow.side_menu_name,
                },
            };
        case "START_EDIT_SIDE_MENU":
            return {
                ...state,
                editSideMenu: {
                    ...state.editSideMenu,
                    loading: true,
                },
            };
        case "SUCCESS_EDIT_SIDE_MENU":
            return {
                ...state,
                editSideMenu: {
                    ...state.editSideMenu,
                    loading: false,
                    successMsg: action.msg,
                    errorMsg: null,
                },
            };
        case "ERROR_EDIT_SIDE_MENU":
            return {
                ...state,
                editSideMenu: {
                    ...state.editSideMenu,
                    loading: false,
                    successMsg: null,
                    errorMsg: action.msg,
                },
            };
        default:
            return state;
    }
};

export default reducer;
