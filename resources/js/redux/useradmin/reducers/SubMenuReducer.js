const initData = {
    subMenus: [],
    startLoadSubMenus: false,
    errorLoadSubMenus: null,
};

const reducer = (state = initData, action) => {
    switch (action.type) {
        case "START_LOAD_SUB_MENUS":
            return {
                ...state,
                startLoadSubMenus: true,
            };
        case "SUCCESS_LOAD_SUB_MENUS":
            return {
                ...state,
                subMenus: action.subMenus,
                startLoadSubMenus: false,
            };
        case "ERROR_LOAD_SUB_MENUS":
            return {
                ...state,
                startLoadSubMenus: false,
                errorLoadSubMenus: action.err,
            };
        default:
            state;
    }
};

export default reducer;
