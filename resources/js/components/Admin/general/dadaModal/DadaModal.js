import React from "react";

export default function DadaModal(props) {
    return (
        <div className="modal" id={props.modalID}>
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h4 className="modal-title">{props.headerText}</h4>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                        >
                            ×
                        </button>
                    </div>
                    {/* Modal body */}
                    <div className="modal-body">{props.children}</div>
                    {/* Modal footer */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-success"
                            data-dismiss="modal"
                            onClick={props.clickEvent}
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
}
