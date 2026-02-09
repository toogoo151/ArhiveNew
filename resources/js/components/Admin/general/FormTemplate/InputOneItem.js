import React from "react";

const InputOneItem = (props) => {
    return (
        <div className="form-group">
            <label>{props.labelName}</label>
            <input
                type={props.inputType}
                className="form-control"
                id={props.inputId}
                placeholder={props.inputePlaceholder}
            />
        </div>
    );
};

export default InputOneItem;
