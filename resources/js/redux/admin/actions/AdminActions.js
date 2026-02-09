import axios from "../../../AxiosUser";

export const loadAdmins = () => {
    return function (dispatch) {
        axios
            .get("/get/amdins")
            .then((res) => {
                dispatch(loadAdminsSuccess(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }

                dispatch(loadAdminsError(err.response.data));
            });
    };
};

export const loadAdminsSuccess = (admins) => {
    return {
        type: "LOAD_ADMINS_SUCCESS",
        admins,
    };
};

export const loadAdminsError = (msg) => {
    return {
        type: "LOAD_ADMINS_ERROR",
        msg,
    };
};
