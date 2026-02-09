import axios from "../../../AxiosUser";

export const loadRequests = () => {
    return function (dispatch) {
        axios
            .get("/get/requests")
            .then((res) => {
                dispatch(startLoadRequest(res.data));
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            })
            .finally();
    };
};

export const startLoadRequest = (requests) => {
    return {
        type: "LOAD_REQUESTS",
        requests,
    };
};

export const approveRequest = (ids) => {
    return function (dispatch) {
        dispatch(startApproveRequest());
        axios
            .post("/approve/requests", {
                ids,
            })
            .then((res) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }

                dispatch(successApproveRequest(res.data));
                dispatch(loadRequests());
            })
            .catch((err) => {
                dispatch(errorApproveRequest(err.response.data));
            })
            .finally();
    };
};

export const startApproveRequest = () => {
    return {
        type: "START_APPROVE_REQUEST",
    };
};

export const successApproveRequest = (msg) => {
    return {
        type: "SUCCESS_APPROVE_REQUEST",
        msg,
    };
};

export const errorApproveRequest = (msg) => {
    return {
        type: "ERROR_APPROVE_REQUEST",
        msg,
    };
};
