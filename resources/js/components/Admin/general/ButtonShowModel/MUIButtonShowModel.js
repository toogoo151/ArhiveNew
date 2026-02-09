const MUIButtonShowModel = (props) => {
    return (
        <button
            style={props.style}
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

export default MUIButtonShowModel;
