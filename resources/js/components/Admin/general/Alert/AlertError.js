import React from "react";

const AlertError = (props) => {
    return (
        <div className="alert alert-danger" role="alert">
            {props.msg}
        </div>
    );
};

export default AlertError;
