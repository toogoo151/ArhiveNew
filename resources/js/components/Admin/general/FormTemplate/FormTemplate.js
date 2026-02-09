import React from "react";

const FormTemplate = (props) => {
    return (
        <div className="modal" id={props.modalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{props.modalTitle}</h4>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                        >
                            ×
                        </button>
                    </div>
                    {/* Modal body */}
                    <div className="modal-body">{props.inputeItem}</div>
                    {/* Modal footer */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-success"
                            // onClick={clickHandlerEditAdmin}
                        >
                            Нэмэх
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            data-dismiss="modal"
                        >
                            Хаах
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormTemplate;
