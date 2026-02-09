import axios from "../../../AxiosUser";

export const loadSubMenus = (sideId) => {
    return function (dispatch) {
        dispatch(startLoadSubMenus());
        axios
            .get(`/get/sub/menu/${sideId}`)
            .then((res) => {
                dispatch(successLoadSubMenus(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(errorLoadSubMenus(err.response.data));
            })
            .finally(() => {
                dispatch(errorLoadSubMenus(null));
            });
    };
};

export const startLoadSubMenus = () => {
    return {
        type: "START_LOAD_SUB_MENUS",
    };
};

export const successLoadSubMenus = (subMenus) => {
    return {
        type: "SUCCESS_LOAD_SUB_MENUS",
        subMenus,
    };
};

export const errorLoadSubMenus = (err) => {
    return {
        type: "ERROR_LOAD_SUB_MENUS",
        err,
    };
};
