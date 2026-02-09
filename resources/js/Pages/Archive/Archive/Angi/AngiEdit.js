import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const AngiEdit = (props) => {
    const [showModal, setShowModal] = useState("");
    const [commandID, setCommandID] = useState("");
    const [angiID, setAngiID] = useState("");
    const [ner, setNer] = useState("");

    const [getDataRow, setDataRow] = useState([]);
    const [getComandlal, setComandlal] = useState([]);

    useEffect(() => {
        axios
            .get("/get/comandlal")
            .then((res) => {
                setComandlal(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setDataRow(props.changeDataRow);
    }, [props.changeDataRow]);

    useEffect(() => {
        if (props.isEditBtnClick) {
            setCommandID(props.changeDataRow.comand_id);
            setAngiID(props.changeDataRow.idangi);
            setNer(props.changeDataRow.ner);
        }
    }, [props.isEditBtnClick]);

    const saveComand = () => {
        props.setRowsSelected([]);
        if (commandID == "" || commandID == null) {
            Swal.fire("Командлал сонгоно уу");
            return;
        }
        if (angiID == "" || angiID == null) {
            Swal.fire("Ангийн дугаар оруулна уу");
            return;
        }
        if (ner == "" || ner == null) {
            Swal.fire("Ангийн нэр оруулна уу.");
            return;
        }

        axios
            .post("/edit/angi", {
                id: props.changeDataRow.id,
                comand_id: commandID,
                idangi: angiID,
                ner: ner,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                setCommandID("");
                setAngiID("");
                setNer("");
                if (window.$) {
                    window.$("#angiEdit").modal("hide");
                }

                props.refreshAngi();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeComandlal = (e) => {
        setCommandID(e.target.value);
    };
    const changeID = (e) => {
        setAngiID(e.target.value);
    };
    const changeNer = (e) => {
        setNer(e.target.value);
    };

    return (
        <>
            <div className="modal" id="angiEdit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">АНГИ ЗАСАХ</h4>

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
                                            Командлалын нэр:
                                        </span>
                                    </div>
                                    <select
                                        className="form-control"
                                        onChange={changeComandlal}
                                        value={commandID}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {getComandlal.map((el) => (
                                            <option key={el.id} value={el.id}>
                                                {el.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Ангийн дугаар:
                                        </span>
                                    </div>
                                    <input
                                        className="form-control"
                                        onChange={changeID}
                                        value={angiID}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Ангийн нэр:
                                        </span>
                                    </div>
                                    <input
                                        className="form-control"
                                        onChange={changeNer}
                                        value={ner}
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

export default AngiEdit;
