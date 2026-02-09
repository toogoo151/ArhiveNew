import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const BaingaNuutsEdit = ({
    refreshBaingaNuuts,
    selectedHumrug,
    selectedDans,
    changeDataRow,
    isEditBtnClick,
    setRowsSelected,
}) => {
    const [showModal, setShowModal] = useState("");
    const [hn_dd, sethn_dd] = useState("");
    const [hn_zbn, sethn_zbn] = useState("");
    const [hereg_burgtel, sethereg_burgtel] = useState("");
    const [hn_garchig, sethn_garchig] = useState("");
    const [nuuts_zereglel, setnuuts_zereglel] = useState("");
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

            sethn_dd(changeDataRow.hn_dd);
            sethn_zbn(changeDataRow.hn_zbn);
            sethereg_burgtel(changeDataRow.hereg_burgtel);
            sethn_garchig(changeDataRow.hn_garchig);
            setnuuts_zereglel(changeDataRow.nuuts_zereglel);
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
            .post("/edit/BaingaNuuts", {
                humrug_id: selectedHumrug,
                dans_id: selectedDans,
                id: changeDataRow.id,
                hn_dd: hn_dd,
                hn_zbn: hn_zbn,
                hereg_burgtel: hereg_burgtel,
                hn_garchig: hn_garchig,
                nuuts_zereglel: nuuts_zereglel,
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
                sethn_dd("");
                sethn_zbn("");
                sethereg_burgtel("");
                sethn_garchig("");
                setnuuts_zereglel("");
                setharya_on("");
                setOnehen("");
                setOnsuul("");
                sethuudas_too("");
                sethabsralt_too("");
                setjagsaalt_zuildugaar("");
                sethn_tailbar("");
                if (window.$) {
                    window.$("#baingaNuutsedit").modal("hide");
                }

                refreshBaingaNuuts();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeHadgalamjDugaar = (e) => {
        sethn_dd(e.target.value);
    };
    const changeZbn = (e) => {
        sethn_zbn(e.target.value);
    };
    const changeHeregBurtgel = (e) => {
        sethereg_burgtel(e.target.value);
    };

    const changeHngarchig = (e) => {
        sethn_garchig(e.target.value);
    };
    const changeNuuts = (e) => {
        setnuuts_zereglel(e.target.value);
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
            <div className="modal" id="baingaNuutsedit">
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
                                            onChange={changeHadgalamjDugaar}
                                            value={hn_dd}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                ЗБ нэгжийн нэр:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeZbn}
                                            value={hn_zbn}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэрэг,данс бүртгэл:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHeregBurtgel}
                                            value={hereg_burgtel}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэрэг бүртгэлийн он:
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
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэрэг данс бүртгэлийн нэр:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHngarchig}
                                            value={hn_garchig}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Нууцын зэрэглэл:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeNuuts}
                                            value={nuuts_zereglel}
                                            readOnly
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
                                                Хуудасны тоо:
                                            </span>
                                        </div>

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

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
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

export default BaingaNuutsEdit;
