import axios from "../../../AxiosUser";

export const loadHeaderMenus = () => {
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

export const loadHeaderMenusSuccess = (headerMenus) => {
    return {
        type: "LOAD_HEADERS_SUCCESS",
        headers: headerMenus,
    };
};

export const loadHeaderMenusError = (error) => {
    return {
        type: "LOAD_HEADERS_ERROR",
        error,
    };
};

export const setSelectedHeaderMenuID = (selectedHeaderMenuID) => {
    return {
        type: "SET_SELECTED_HEADER_MENU_ID",
        selectedHeaderMenuID,
    };
};

export const loadSideMenu = (headerMenuID) => {
    console.log(headerMenuID);
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
            });
    };
};

export const loadSideMenusSuccess = (sideMenus) => {
    return {
        type: "LOAD_SIDE_MENU_SUCCESS",
        sideMenus: sideMenus,
    };
};

export const loadSideMenusError = (error) => {
    return {
        type: "LOAD_SIDE_MENU_ERROR",
        error,
    };
};

// SIDE MENU EDIT HESGIIN OBJECTIIG AVAH HESEG SIDEMENUID-AAR N AVNA
export const loadSideMenuRow = (sideMenuID) => {
    return function (dispatch) {
        axios
            .get(`/get/side/menu/${sideMenuID}`)
            .then((res) => {
                if (res.data) {
                    dispatch(loadSideMenuRowSuccess(res.data));
                }
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            });
    };
};

export const loadSideMenuRowSuccess = (sideMenuRow) => {
    return {
        type: "LOAD_SIDE_MENU_ROW_SUCCESS",
        sideMenuRow,
    };
};

export const editSideMenu = (id, header, parent, sideMenuName) => {
    return function (dispatch) {
        console.log("============>" + id);
        dispatch(startEditSideMenu());
        axios
            .post("/side/menu/edit", {
                _token: document.querySelector('meta[name="csrf-token"]')
                    .content,
                id,
                header,
                parent,
                sideMenuName,
            })
            .then((res) => {
                dispatch(successEditSideMenu(res.data.msg));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(errorEditSideMenu(err.data.msg));
            });
    };
};

export const startEditSideMenu = () => {
    return {
        type: "START_EDIT_SIDE_MENU",
    };
};

export const successEditSideMenu = (msg) => {
    return {
        type: "SUCCESS_EDIT_SIDE_MENU",
        msg,
    };
};

export const errorEditSideMenu = (msg) => {
    return {
        type: "ERROR_EDIT_SIDE_MENU",
        msg,
    };
};
