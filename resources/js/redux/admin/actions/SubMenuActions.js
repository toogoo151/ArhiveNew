import axios from "../../../AxiosUser";

export const loadHederMenu = () => {
    return function (dispatch) {
        axios
            .get("/get/header/menu")
            .then((res) => {
                dispatch(loadHeaderMenusSuccess(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(
                    loadHeaderMenusError(
                        "Алдаа гарлаа. Веб мастерт хандана уу."
                    )
                );
            });
    };
};

export const loadHeaderMenusSuccess = (headerMenu) => {
    return {
        type: "LOAD_HEADER_MENU_SUCCESS",
        headerMenu,
    };
};

export const loadHeaderMenusError = (err) => {
    return {
        type: "LOAD_HEADER_MENU_ERROR",
        err,
    };
};

export const loadSideMenu = (headerMenuID) => {
    return function (dispatch) {
        axios
            .get(`/get/side/menu/full/tree/${headerMenuID}`)
            .then((res) => {
                dispatch(loadSideMenusSuccess(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(
                    loadSideMenusErr("Алдаа гарлаа. Веб мастерт хандана уу.")
                );
            });
    };
};

export const loadSideMenusSuccess = (sideMenu) => {
    return {
        type: "LOAD_SIDE_MENU_SUCCESS",
        sideMenu,
    };
};

export const loadSideMenusErr = (err) => {
    return {
        type: "LOAD_SIDE_MENU_ERROR",
        err,
    };
};

// start Sub Menu
export const loadSubMenu = (sideMenuID) => {
    return function (dispatch) {
        axios
            .get(`/get/sub/menu/${sideMenuID}`)
            .then((res) => {
                dispatch(loadSubMenusSuccess(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(
                    loadSubMenusErr("Алдаа гарлаа. Веб мастерт хандана уу.")
                );
            });
    };
};

export const loadSubMenusSuccess = (subMenus) => {
    return {
        type: "LOAD_SUB_MENU_SUCCESS",
        subMenus,
    };
};

export const loadSubMenusErr = (err) => {
    return {
        type: "LOAD_SUB_MENU_ERROR",
        err,
    };
};
// end Sub menu

// start Sub menu Edit
export const newSubMenu = (sideMenu, subMenu) => {
    return function (dispatch) {
        dispatch(startNewSubMenu());
        axios
            .post("/new/sub/menu", {
                _token: document.querySelector('meta[name="csrf-token"]')
                    .content,
                sideMenu,
                subMenu,
            })
            .then((res) => {
                dispatch(successNewSubMenu(res.data.msg));
            })
            .catch((err) => {
                dispatch(errorNewSubMenu(err.data.msg));
            });
    };
};

export const startNewSubMenu = () => {
    return {
        type: "START_NEW_SUB_MENU",
    };
};

export const successNewSubMenu = (msg) => {
    return {
        type: "SUCCESS_NEW_SUB_MENU",
        msg,
    };
};

export const errorNewSubMenu = (msg) => {
    return {
        type: "ERROR_NEW_SUB_MENU",
        msg,
    };
};
