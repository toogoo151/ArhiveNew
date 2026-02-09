import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const JagsaaltEdit = (props) => {
    const [jagsaalt_turul, setJagsaaltTurul] = useState("");
    const [barimt_dd, setBarimtDd] = useState("");
    const [barimt_turul, setBarimtTurul] = useState("");
    const [barimt_dedturul, setBarimtDedturul] = useState("");
    const [barimt_ner, setBarimtNer] = useState("");
    const [hugatsaa_turul, setHugatsaaTurul] = useState("");
    const [hugatsaa, setHugatsaa] = useState("");
    const [tailbar, setTailbar] = useState("");
    const [tobchlol, setTobchlol] = useState("");
    const [getJagsaalt, setJagsaalt] = useState([]);
    const [getHugatsaaTurul, setGetHugatsaaTurul] = useState([]);
    const lastHandledEditRequestIdRef = useRef(0);

    useEffect(() => {
        axios
            .get("/get/jagsaaltTurul")
            .then((res) => {
                setJagsaalt(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get("/get/hugatsaaTurul")
            .then((res) => {
                setGetHugatsaaTurul(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const resolveJagsaaltTurulId = (rowValue) => {
        if (rowValue === null || rowValue === undefined || rowValue === "") return "";
        // If rowValue is already an id, keep it.
        const byId = getJagsaalt.find((el) => String(el.id) === String(rowValue));
        if (byId) return String(byId.id);
        // If rowValue is stored as text (jName), map it back to id for the dropdown.
        const byName = getJagsaalt.find((el) => String(el.jName) === String(rowValue));
        if (byName) return String(byName.id);
        return String(rowValue);
    };

    useEffect(() => {
        // Only open modal on explicit Edit button click.
        // Row selection updates `changeDataRow`, but must NOT open the modal.
        if (!props.isEditBtnClick) return;

        // Only react to *new* edit requests (prevents modal opening on row select)
        if (!props.editRequestId) return;
        if (props.editRequestId === lastHandledEditRequestIdRef.current) return;
        lastHandledEditRequestIdRef.current = props.editRequestId;

        if (props.changeDataRow?.id) {
            setJagsaaltTurul(resolveJagsaaltTurulId(props.changeDataRow.jagsaalt_turul));
            setBarimtDd(props.changeDataRow.barimt_dd ?? "");
            setBarimtTurul(props.changeDataRow.barimt_turul ?? "");
            setBarimtDedturul(props.changeDataRow.barimt_dedturul ?? "");
            setBarimtNer(props.changeDataRow.barimt_ner ?? "");
            setHugatsaaTurul(props.changeDataRow.hugatsaa_turul ?? "");
            setHugatsaa(props.changeDataRow.hugatsaa ?? "");
            setTailbar(props.changeDataRow.tailbar ?? "");
            setTobchlol(props.changeDataRow.tobchlol ?? "");

            // Open modal when edit button is clicked
            if (window.$) {
                window.$("#jagsaaltedit").modal("show");
            }
        }
    }, [props.isEditBtnClick, props.editRequestId, props.changeDataRow, getJagsaalt]);

    const saveComand = () => {
        if (props.setRowsSelected) {
            props.setRowsSelected([]);
        }
        if (barimt_ner == "" || barimt_ner == null) {
            Swal.fire("Баримтын нэр оруулна уу");
            return;
        }

        axios
            .post("/edit/jagsaalt", {
                id: props.changeDataRow.id,
                // Save the text (jName) in DB, keep dropdown using id.
                jagsaalt_turul:
                    getJagsaalt.find((el) => String(el.id) === String(jagsaalt_turul))
                        ?.jName ?? jagsaalt_turul,
                barimt_dd: barimt_dd,
                barimt_turul: barimt_turul,
                barimt_dedturul: barimt_dedturul,
                barimt_ner: barimt_ner,
                hugatsaa_turul: hugatsaa_turul,
                hugatsaa: hugatsaa,
                tailbar: tailbar,
                tobchlol: tobchlol,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                setJagsaaltTurul("");
                setBarimtDd("");
                setBarimtTurul("");
                setBarimtDedturul("");
                setBarimtNer("");
                setHugatsaaTurul("");
                setHugatsaa("");
                setTailbar("");
                setTobchlol("");
                if (window.$) {
                    window.$("#jagsaaltedit").modal("hide");
                }

                if (props.refreshJagsaalt) {
                    props.refreshJagsaalt();
                }
            })
            .catch((err) => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    const updateTobchlol = (jagsaaltId, retentionId) => {
        const jagsaaltValue = jagsaaltId || jagsaalt_turul;
        const retentionValue = retentionId || hugatsaa_turul;

        if (!jagsaaltValue || jagsaaltValue === "0" || !retentionValue || retentionValue === "0") {
            setTobchlol("");
            return;
        }

        const selectedJagsaalt = getJagsaalt.find(
            (el) => String(el.id) === String(jagsaaltValue)
        );
        const selectedRetention = getHugatsaaTurul.find(
            (el) => String(el.id) === String(retentionValue)
        );

        if (!selectedJagsaalt || !selectedRetention) {
            setTobchlol("");
            return;
        }

        // Get abbreviation from jagsaalt_turul
        let jagsaaltAbbrev = "";
        if (selectedJagsaalt.jName.includes("Салбарын")) {
            jagsaaltAbbrev = "СЖ";
        } else if (selectedJagsaalt.jName.includes("Үлгэрчилсэн")) {
            jagsaaltAbbrev = "ҮЖ";
        } else if (selectedJagsaalt.jName.includes("Байгууллагын")) {
            jagsaaltAbbrev = "БЖ";
        }

        // Get value from retention_period
        let retentionText = "";
        if (selectedRetention.RetName.includes("Байнга")) {
            retentionText = "Байнга";
        } else if (selectedRetention.RetName.includes("70 жил")) {
            retentionText = "70 жил";
        } else if (selectedRetention.RetName.includes("Түр")) {
            retentionText = "жил";
        }

        // Combine and set tobchlol
        if (jagsaaltAbbrev && retentionText) {
            setTobchlol(`${jagsaaltAbbrev}-${retentionText}`);
        } else {
            setTobchlol("");
        }
    };

    const changeDateType = (selectedId) => {
        if (!selectedId || selectedId === "0") {
            setHugatsaa("");
            updateTobchlol(null, selectedId);
            return;
        }

        const selected = getHugatsaaTurul.find(
            (el) => String(el.id) === String(selectedId)
        );

        if (!selected) return;

        let hugatsaaValue = "";

        if (selected.RetName.includes("Байнга")) {
            hugatsaaValue = "Байнга";
        } else if (selected.RetName.includes("70 жил")) {
            hugatsaaValue = "70 жил";
        } else if (selected.RetName.includes("Түр")) {
            hugatsaaValue = "Жил";
        }

        setHugatsaa(hugatsaaValue);
        updateTobchlol(null, selectedId);
    };

    const changeJagsaaltTurul = (e) => {
        const newValue = e.target.value;
        setJagsaaltTurul(newValue);
        updateTobchlol(newValue, null);
    };
    const changeBarimtDd = (e) => {
        setBarimtDd(e.target.value);
    };
    const changeBarimtTurul = (e) => {
        setBarimtTurul(e.target.value);
    };
    const changeBarimtDedturul = (e) => {
        setBarimtDedturul(e.target.value);
    };
    const changeBarimtNer = (e) => {
        setBarimtNer(e.target.value);
    };
    const changeHugatsaaTurul = (e) => {
        const newValue = e.target.value;
        setHugatsaaTurul(newValue);
        changeDateType(newValue);
    };
    const changeHugatsaa = (e) => {
        setHugatsaa(e.target.value);
    };
    const changeTailbar = (e) => {
        setTailbar(e.target.value);
    };

    return (
        <>
            <div className="modal" id="jagsaaltedit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title"> ЗАСАХ</h4>

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
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Жагсаалтын төрөл:
                                            </span>
                                        </div>
                                        <select
                                            className="form-control"
                                            onChange={changeJagsaaltTurul}
                                            value={jagsaalt_turul}
                                        >
                                            <option value="0">Сонгоно уу</option>
                                            {getJagsaalt.map((el) => (
                                                <option key={el.id} value={el.id}>
                                                    {el.jName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Баримтын төрөл:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeBarimtTurul}
                                            value={barimt_turul}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Баримтын дэд төрөл:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeBarimtDedturul}
                                            value={barimt_dedturul}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Дэс дугаар:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeBarimtDd}
                                            value={barimt_dd}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Баримтын нэр:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeBarimtNer}
                                            value={barimt_ner}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хадгалах хугацааны төрөл:
                                            </span>
                                        </div>
                                        <select
                                            className="form-control"
                                            onChange={changeHugatsaaTurul}
                                            value={hugatsaa_turul}
                                        >
                                            <option value="0">Сонгоно уу</option>
                                            {getHugatsaaTurul.map((el) => (
                                                <option key={el.id} value={el.id}>
                                                    {el.RetName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хадгалах хугацаа:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHugatsaa}
                                            value={hugatsaa}
                                            // readOnly
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Товчлол:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            value={tobchlol}
                                            // readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Тайлбар:
                                        </span>
                                    </div>
                                    <input
                                        className="form-control"
                                        onChange={changeTailbar}
                                        value={tailbar}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-success"
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

export default JagsaaltEdit;
