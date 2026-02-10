import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const TurIltEdit = ({
    refreshTurIlt,
    selectedHumrug,
    selectedDans,
    changeDataRow,
    isEditBtnClick,
    setRowsSelected,
}) => {
    const [showModal, setShowModal] = useState("");
    const [hadgalamj_dugaar, sethadgalamj_dugaar] = useState("");
    const [hadgalamj_garchig, sethadgalamj_garchig] = useState("");
    const [hadgalamj_zbn, sethadgalamj_zbn] = useState("");
    const [hergiin_indeks, sethergiin_indeks] = useState("");
    const [harya_on, setharya_on] = useState("");
    const [on_ehen, setOnehen] = useState("");
    const [on_suul, setOnsuul] = useState("");
    const [huudas_too, sethuudas_too] = useState("");
    const [habsralt_too, sethabsralt_too] = useState("");
    const [jagsaalt_zuildugaar, setjagsaalt_zuildugaar] = useState("");
    const [hn_tailbar, sethn_tailbar] = useState("");

    const [getDataRow, setDataRow] = useState([]);

    useEffect(() => {
        setDataRow(changeDataRow);
    }, [changeDataRow]);
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return dateString.split(" ")[0]; // YYYY-MM-DD
    };
    useEffect(() => {
        if (isEditBtnClick && changeDataRow) {
            setOnehen(formatDateForInput(changeDataRow.on_ehen));
            setOnsuul(formatDateForInput(changeDataRow.on_suul));
            sethadgalamj_dugaar(changeDataRow.hadgalamj_dugaar);
            sethadgalamj_garchig(changeDataRow.hadgalamj_garchig);
            sethadgalamj_zbn(changeDataRow.hadgalamj_zbn);
            sethergiin_indeks(changeDataRow.hergiin_indeks);
            setharya_on(changeDataRow.harya_on);
            sethuudas_too(changeDataRow.huudas_too);
            sethabsralt_too(changeDataRow.habsralt_too ?? "");
            setjagsaalt_zuildugaar(changeDataRow.jagsaalt_zuildugaar);
            sethn_tailbar(changeDataRow.hn_tailbar ?? "");
        }
    }, [isEditBtnClick]);
    useEffect(() => {
        if (on_ehen) {
            const year = new Date(on_ehen).getFullYear();
            setharya_on(year.toString());
        }
    }, [on_ehen]);

    const saveComand = () => {
        setRowsSelected([]);

        axios
            .post("/edit/TurIlt", {
                humrug_id: selectedHumrug,
                dans_id: selectedDans,
                id: changeDataRow.id,
                hadgalamj_dugaar: hadgalamj_dugaar,
                hadgalamj_garchig: hadgalamj_garchig,
                hadgalamj_zbn: hadgalamj_zbn,
                hergiin_indeks: hergiin_indeks,
                harya_on: harya_on,
                on_ehen: on_ehen,
                on_suul: on_suul,
                huudas_too: huudas_too,
                habsralt_too: habsralt_too,
                jagsaalt_zuildugaar: jagsaalt_zuildugaar,
                hn_tailbar: hn_tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                sethadgalamj_dugaar("");
                sethadgalamj_garchig("");
                sethadgalamj_zbn("");
                sethergiin_indeks("");
                setharya_on("");
                setOnehen("");
                setOnsuul("");
                sethuudas_too("");
                sethabsralt_too("");
                setjagsaalt_zuildugaar("");
                sethn_tailbar("");
                if (window.$) {
                    window.$("#turIltEdit").modal("hide");
                }

                refreshTurIlt();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changehndd = (e) => {
        sethadgalamj_dugaar(e.target.value);
    };
    const changeHadgarchig = (e) => {
        sethadgalamj_garchig(e.target.value);
    };
    const changeHadZbn = (e) => {
        sethadgalamj_zbn(e.target.value);
    };

    const changeIndex = (e) => {
        sethergiin_indeks(e.target.value);
    };
    const changeHarya = (e) => {
        setharya_on(e.target.value);
    };
    const changeOnehen = (e) => {
        setOnehen(e.target.value);
    };
    const changeOnsuul = (e) => {
        setOnsuul(e.target.value);
    };
    const changeHuudas = (e) => {
        sethuudas_too(e.target.value);
    };
    const changeHavsralt = (e) => {
        sethabsralt_too(e.target.value);
    };
    const changeZuildugaar = (e) => {
        setjagsaalt_zuildugaar(e.target.value);
    };
    const changeTailbar = (e) => {
        sethn_tailbar(e.target.value);
    };

    return (
        <>
            <div className="modal" id="turIltEdit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">
                                ХАДГАЛАМЖИЙН НЭГЖ ЗАСАХ
                            </h4>

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
                                                Дугаар:
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            onChange={changehndd}
                                            value={hadgalamj_dugaar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хадгаламжийн нэгжийн гарчиг:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHadgarchig}
                                            value={hadgalamj_garchig}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                ЗБ нэгжийн нэр:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHadZbn}
                                            value={hadgalamj_zbn}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэргийн индекс:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeIndex}
                                            value={hergiin_indeks}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Эхэлсэн он:
                                            </span>
                                        </div>
                                        <input
                                            type="date"
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
                                                Дууссан он:
                                            </span>
                                        </div>

                                        <input
                                            type="date"
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
                                                Харьяа он:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHarya}
                                            value={harya_on}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хуудасны тоо:
                                            </span>
                                        </div>

                                        {/* <input
                                            type="number"
                                            {...register("habsralt_too", {
                                                valueAsNumber: true,
                                            })}
                                            className="form-control"
                                        /> */}

                                        <input
                                            type="number"
                                            className="form-control"
                                            onChange={changeHuudas}
                                            value={huudas_too}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хавсралтын тоо:
                                            </span>
                                        </div>

                                        <input
                                            type="number"
                                            className="form-control"
                                            onChange={changeHavsralt}
                                            value={habsralt_too}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i
                                                    className="fa fa-search"
                                                    style={{
                                                        color: "#458ad8",
                                                        cursor: "pointer",
                                                        marginRight: "6px",
                                                        fontSize: "18px",
                                                        transition: "0.2s",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.target.style.color =
                                                            "#154388")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.target.style.color =
                                                            "#1619a8")
                                                    }
                                                    onClick={() => {
                                                        window
                                                            .$("#HadHugatsaa")
                                                            .modal({
                                                                backdrop:
                                                                    "static",
                                                                keyboard: false,
                                                            });
                                                    }}
                                                ></i>
                                                Жагсаалтын зүйлийн дугаар:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeZuildugaar}
                                            value={jagsaalt_zuildugaar}
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
                                        value={hn_tailbar}
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

export default TurIltEdit;
