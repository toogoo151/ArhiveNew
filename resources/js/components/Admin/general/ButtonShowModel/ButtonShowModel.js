import React from "react";

const ButtonShowModel = (props) => {
    return (
        <button
            style={{ marginLeft: "5px" }}
            type="button"
            className={props.btnClassName}
            data-toggle={props.modelType}
            data-target={props.dataTargetID}
            onClick={props.clickHeaderOpenModal}
        >
            <span className={props.spanIconClassName}></span>
            &nbsp; {props.buttonName}
        </button>
    );
};

export default ButtonShowModel;
