import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const DansBurtgelEdit = ({
    refreshDans,
    selectedHumrug,
    selectedRetention,
    changeDataRow,
    isEditBtnClick,
    setRowsSelected,
}) => {
    const [showModal, setShowModal] = useState("");
    const [dans_baidal, setDansbaidal] = useState("");
    const [humrug_niit, setHumrugniit] = useState("");
    const [dans_dugaar, setDansdugaar] = useState("");
    const [dans_ner, setDansner] = useState("");
    const [on_ehen, setOnehen] = useState("");
    const [on_suul, setOnsuul] = useState("");
    const [dans_niit, setDansniit] = useState("");
    const [hubi_dans, setHubidans] = useState("");
    const [dans_tailbar, setDanstailbar] = useState("");

    const [getDataRow, setDataRow] = useState([]);
    const [getSecType, setSecType] = useState([]);

    useEffect(() => {
        axios
            .get("/get/secretType")
            .then((res) => {
                setSecType(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setDataRow(changeDataRow);
    }, [changeDataRow]);

    useEffect(() => {
        if (isEditBtnClick && changeDataRow) {
            setDansbaidal(changeDataRow.dans_baidal);
            setHumrugniit(changeDataRow.humrug_niit);
            setDansdugaar(changeDataRow.dans_dugaar);
            setDansner(changeDataRow.dans_ner);
            setOnehen(changeDataRow.on_ehen);
            setOnsuul(changeDataRow.on_suul);
            setDansniit(changeDataRow.dans_niit);
            setHubidans(changeDataRow.hubi_dans);
            setDanstailbar(changeDataRow.dans_tailbar ?? "");
        }
    }, [isEditBtnClick]);

    const saveComand = () => {
        setRowsSelected([]);
        if (dans_baidal == "" || dans_baidal == null) {
            Swal.fire("Нууцын зэрэг оруулна уу");
            return;
        }
        if (humrug_niit == "" || humrug_niit == null) {
            Swal.fire("Хөмрөгийн нийт ХН оруулна уу");
            return;
        }
        if (dans_dugaar == "" || dans_dugaar == null) {
            Swal.fire("Дансны дугаар оруулна уу.");
            return;
        }
        if (dans_ner == "" || dans_ner == null) {
            Swal.fire("Дансны нэр оруулна уу.");
            return;
        }
        if (on_ehen == "" || dans_ner == null) {
            Swal.fire("Он хязаар эхэн оруулна уу.");
            return;
        }
        if (dans_niit == "" || dans_ner == null) {
            Swal.fire("Он хязгаар сүүл оруулна уу.");
            return;
        }
        if (hubi_dans == "" || dans_ner == null) {
            Swal.fire("Хувь данс оруулна уу.");
            return;
        }
        if (dans_tailbar == "" || dans_ner == null) {
            Swal.fire("Тайлбар оруулна уу.");
            return;
        }

        axios
            .post("/edit/dans", {
                humrugID: selectedHumrug,
                hadgalah_hugatsaa: selectedRetention,
                id: changeDataRow.id,
                dans_baidal: dans_baidal,
                dans_dugaar: dans_dugaar,
                dans_ner: dans_ner,
                humrug_niit: humrug_niit,
                dans_niit: dans_niit,
                on_ehen: on_ehen,
                on_suul: on_suul,
                hubi_dans: hubi_dans,
                dans_tailbar: dans_tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                setDansbaidal("");
                setHumrugniit("");
                setDansdugaar("");
                setDansner("");
                setOnehen("");
                setOnsuul("");
                setDansniit("");
                setHubidans("");
                setDanstailbar("");
                if (window.$) {
                    window.$("#dansburtgeledit").modal("hide");
                }

                refreshDans();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeDansbaidal = (e) => {
        setDansbaidal(e.target.value);
    };
    const changeHumrugniit = (e) => {
        setHumrugniit(e.target.value);
    };
    const changeHumrugZereglel = (e) => {
        setHumrugZereglel(e.target.value);
    };

    const changeDansdugaar = (e) => {
        setDansdugaar(e.target.value);
    };
    const changeDansner = (e) => {
        setDansner(e.target.value);
    };
    const changeOnehen = (e) => {
        setOnehen(e.target.value);
    };
    const changeOnsuul = (e) => {
        setOnsuul(e.target.value);
    };
    const changeDansNiit = (e) => {
        setDansniit(e.target.value);
    };
    const changeHubiDans = (e) => {
        setHubidans(e.target.value);
    };
    const changeDansTailbar = (e) => {
        setDanstailbar(e.target.value);
    };

    return (
        <>
            <div className="modal" id="dansburtgeledit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">ДАНС БҮРТГЭЛ ЗАСАХ</h4>

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
                                                Нууцын зэрэг:
                                            </span>
                                        </div>
                                        <select
                                            className="form-control"
                                            onChange={changeDansbaidal}
                                            value={dans_baidal}
                                        >
                                            <option value="">Сонгоно уу</option>
                                            {getSecType.map((el) => (
                                                <option
                                                    key={el.id}
                                                    value={el.Sname}
                                                >
                                                    {el.Sname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хөмрөгийн нийт ХН:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHumrugniit}
                                            value={humrug_niit}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Дансны дугаар:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeDansdugaar}
                                            value={dans_dugaar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Дансны нэр:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeDansner}
                                            value={dans_ner}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Оны хязгаар эхэн:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeOnehen}
                                            value={on_ehen}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Оны хязгаар сүүл:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeOnsuul}
                                            value={on_suul}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Тухайн дансны ХН:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeDansNiit}
                                            value={dans_niit}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэдэн хувь данс:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeHubiDans}
                                            value={hubi_dans}
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
                                        onChange={changeDansTailbar}
                                        value={dans_tailbar}
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

export default DansBurtgelEdit;
