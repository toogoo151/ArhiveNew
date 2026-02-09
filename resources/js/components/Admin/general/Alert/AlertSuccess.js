import React from "react";

const AlertSuccess = (props) => {
    return (
        <div className="alert alert-success" role="alert">
            {props.msg}
        </div>
    );
};

export default AlertSuccess;
