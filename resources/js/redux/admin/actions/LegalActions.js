import axios from "../../../AxiosUser";

export const newLegal = (subMenuID, title, comment, pdf, videoUrl) => {
    return function (dispatch) {
        dispatch(newLegalStart());
        axios
            .post("/legal/new", {
                _token: document.querySelector('meta[name="csrf-token"]')
                    .content,
                sub: subMenuID,
                title,
                comment,
                pdf,
                videoUrl,
            })
            .then((res) => {
                dispatch(newLegalSuccess(res.data.msg));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(newLegalError(err.data.msg));
            })
            .finally(() => {
                dispatch(newLegalError(""));
            });
    };
};

export const newLegalStart = () => {
    return {
        type: "NEW_LEGAL_START",
    };
};
export const newLegalSuccess = (msg) => {
    return {
        type: "NEW_LEGAL_SUCCESS",
        msg,
    };
};
export const newLegalError = (msg) => {
    return {
        type: "NEW_LEGAL_ERROR",
        msg,
    };
};

export const loadLegals = (id) => {
    return function (dispatch) {
        axios
            .get(`/get/legals/${id}`)
            .then((res) => {
                dispatch(loadLegalSuccess(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                dispatch(loadLegalError(err.data.msg));
            });
    };
};

export const loadLegalSuccess = (legals) => {
    return {
        type: "LOAD_LEGAL_SUCCESS",
        legals,
    };
};

export const loadLegalError = (msg) => {
    return {
        type: "LOAD_LEGAL_ERROR",
        msg,
    };
};
