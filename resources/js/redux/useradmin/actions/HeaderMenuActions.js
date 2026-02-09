import axios from "../../../AxiosUser";

export const loadHeaderMenu = () => {
    return function (dispatch) {
        dispatch(startLoadHeaderMenu);
        axios
            .get("/get/header/menu")
            .then((res) => {
                dispatch(successLoadHeaderMenu(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(errorLoadHeaderMenu(err.response.data));
            })
            .finally(() => {
                dispatch(errorLoadHeaderMenu(null));
            });
    };
};

export const startLoadHeaderMenu = () => {
    return {
        type: "START_LOAD_HEADER_MENU",
    };
};

export const successLoadHeaderMenu = (headers) => {
    return {
        type: "SUCCESS_LOAD_HEADER_MENU",
        headers,
    };
};

export const errorLoadHeaderMenu = (err) => {
    return {
        type: "ERROR_LOAD_HEADER_MENU",
        err,
    };
};
