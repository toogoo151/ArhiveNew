import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const ComandlalEdit = (props) => {
    const [showModal, setShowModal] = useState("");
    const [name, setName] = useState("");
    const [ShortName, setShortName] = useState("");

    const [getDataRow, setDataRow] = useState([]);

    useEffect(() => {
        setDataRow(props.changeDataRow);
    }, [props.changeDataRow]);

    useEffect(() => {
        if (props.isEditBtnClick) {
            setName(props.changeDataRow.name);
            setShortName(props.changeDataRow.ShortName);
        }
    }, [props.isEditBtnClick]);

    const saveComand = () => {
        props.setRowsSelected([]);
        if (name == "" || name == null) {
            Swal.fire("Нэрээ оруулна уу");
            return;
        }
        if (ShortName == "" || ShortName == null) {
            Swal.fire("Товч нэр оруулна уу.");
            return;
        }

        axios
            .post("/edit/comandlal", {
                id: props.changeDataRow.id,
                name: name,
                ShortName: ShortName,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                setName("");
                setShortName("");
                if (window.$) {
                    window.$("#comandlalEdit").modal("hide");
                }

                props.refreshComandlal();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeName = (e) => {
        setName(e.target.value);
    };
    const changeShrtName = (e) => {
        setShortName(e.target.value);
    };

    return (
        <>
            <div className="modal" id="comandlalEdit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">КОМАНДЛАЛ ЗАСАХ</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Нэр:
                                        </span>
                                    </div>
                                    <input
                                        className="form-control"
                                        onChange={changeName}
                                        value={name}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Товч нэр:
                                        </span>
                                    </div>
                                    <input
                                        className="form-control"
                                        onChange={changeShrtName}
                                        value={ShortName}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-success"
                                data-dismiss=""
                                onClick={saveComand}
                            >
                                Засах
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
        </>
    );
};

export default ComandlalEdit;
