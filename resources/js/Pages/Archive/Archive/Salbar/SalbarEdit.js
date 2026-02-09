import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const SalbarEdit = (props) => {
    const [showModal, setShowModal] = useState("");

    const [comand_id, setComandID] = useState("");
    const [angi, setAngi] = useState("");
    const [salbar, setSalbar] = useState("");
    const [t_ner, setTner] = useState("");
    const [b_ner, setBner] = useState("");

    const [getDataRow, setDataRow] = useState({});
    const [getComandlal, setComandlal] = useState([]);
    const [getUnits, setUnit] = useState([]);

    // Командлал авах
    useEffect(() => {
        axios
            .get("/get/comandlal")
            .then((res) => setComandlal(res.data))
            .catch((err) => console.log(err));
    }, []);

    // Мөр сонгогдоход input-ийг бөглөх
    useEffect(() => {
        if (props.changeDataRow) {
            setDataRow(props.changeDataRow);

            const cmdID = String(props.changeDataRow.comandlalIDshuu || "");
            const angiID = String(props.changeDataRow.unitIDshuu || "");

            setComandID(cmdID);
            setAngi(angiID);
            setSalbar(props.changeDataRow.salbar || "");
            setTner(props.changeDataRow.t_ner || "");
            setBner(props.changeDataRow.b_ner || "");

            if (cmdID) {
                axios
                    .post("/get/angi/byComandlalID", { id: cmdID })
                    .then((res) => setUnit(res.data))
                    .catch(() => setUnit([]));
            } else {
                setUnit([]);
            }
        }
    }, [props.changeDataRow]);

    // Командлал сонгогдоход анги авах
    useEffect(() => {
        if (!comand_id) {
            setUnit([]);
            return;
        }

        axios
            .post("/get/angi/byComandlalID", { id: comand_id })
            .then((res) => setUnit(res.data))
            .catch(() => setUnit([]));
    }, [comand_id]);

    // Edit товч
    const clickHandlerEditBtn = () => {
        if (!props.changeDataRow) {
            Swal.fire("Засах мөр сонгоно уу");
            return;
        }

        const cmdID = String(props.changeDataRow.comandlalIDshuu || "");
        setComandID(cmdID);

        // Анги авч ирэх
        if (cmdID) {
            axios
                .post("/get/angi/byComandlalID", { id: cmdID })
                .then((res) => {
                    console.log("Units:", res.data); // шалгах
                    setUnit(res.data);
                    // Сонгогдсон анги-г тохируулах
                    setAngi(String(props.changeDataRow.unitIDshuu || ""));
                })
                .catch(() => setUnit([]));
        }

        setShowModal("modal");
    };

    const [angiSearch, setAngiSearch] = useState("");

    // Хадгалах
    const saveUnitSub = () => {
        if (!comand_id) return Swal.fire("Командлалаа сонгоно уу.");
        if (!angi) return Swal.fire("Анги сонгоно уу.");
        if (!salbar) return Swal.fire("Салбарын нэр оруулна уу.");
        if (!t_ner) return Swal.fire("Товч нэр оруулна уу.");
        if (!b_ner) return Swal.fire("Бүтэн нэр оруулна уу.");

        axios
            .post("/edit/salbar", {
                id: getDataRow.id,
                comand_id: comand_id,
                angi: angi,
                salbar: salbar,
                t_ner: t_ner,
                b_ner: b_ner,
            })
            .then((res) => {
                Swal.fire(res.data.msg);

                // if (window.$) {
                //     window.$("#salbarEdit").modal("hide");
                // }
                props.refreshSalbar();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            {/* <ButtonShowModel
                btnClassName={"btn btn-warning"}
                modelType={showModal}
                dataTargetID={"#salbarEdit"}
                spanIconClassName={"fas fa-solid fa-pen"}
                buttonName={"Засах"}
                clickHeaderOpenModal={clickHandlerEditBtn}
            /> */}

            <div className="modal" id="salbarEdit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Салбар засах</h4>
                            <button className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Командлал */}
                            <div className="row mb-2">
                                <div className="col-md-3">
                                    <label>Командлал:</label>
                                </div>
                                <div className="col-md-9">
                                    <select
                                        className="form-control"
                                        value={comand_id || ""}
                                        onChange={(e) =>
                                            setComandID(e.target.value)
                                        }
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {getComandlal.map((el) => (
                                            <option
                                                key={el.id}
                                                value={String(el.id)}
                                            >
                                                {el.ShortName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Анги */}
                            <div className="row mb-2">
                                <div className="col-md-3">
                                    <label>Анги:</label>
                                </div>

                                <div className="col-md-9">
                                    <Select
                                        options={getUnits.map((unit) => ({
                                            value: String(unit.id),
                                            label: unit.ner,
                                        }))}
                                        value={
                                            getUnits
                                                .filter(
                                                    (unit) =>
                                                        String(unit.id) ===
                                                        String(angi)
                                                )
                                                .map((unit) => ({
                                                    value: String(unit.id),
                                                    label: unit.ner,
                                                }))[0] || null
                                        }
                                        onChange={(selectedOption) =>
                                            setAngi(
                                                selectedOption
                                                    ? selectedOption.value
                                                    : ""
                                            )
                                        }
                                        placeholder="Сонгоно уу"
                                        isSearchable={true}
                                    />
                                </div>
                            </div>

                            {/* Салбар нэр */}
                            <div className="row mb-2">
                                <div className="col-md-3">
                                    <label>Салбар нэр:</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        className="form-control"
                                        value={salbar || ""}
                                        onChange={(e) =>
                                            setSalbar(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Товч нэр */}
                            <div className="row mb-2">
                                <div className="col-md-3">
                                    <label>Товч нэр:</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        className="form-control"
                                        value={t_ner || ""}
                                        onChange={(e) =>
                                            setTner(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Бүтэн нэр */}
                            <div className="row mb-2">
                                <div className="col-md-3">
                                    <label>Бүтэн нэр:</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        className="form-control"
                                        value={b_ner || ""}
                                        onChange={(e) =>
                                            setBner(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-success"
                                onClick={saveUnitSub}
                            >
                                Засах
                            </button>
                            <button
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

export default SalbarEdit;
