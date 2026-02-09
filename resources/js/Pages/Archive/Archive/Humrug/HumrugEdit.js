import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const HumrugEdit = (props) => {
    const [showModal, setShowModal] = useState("");
    const [humrug_dugaar, setHumrugDugaar] = useState("");
    const [humrug_ner, setHumrugNer] = useState("");
    const [humrug_zereglel, setHumrugZereglel] = useState("");
    const [anhnii_ognoo, setOgnoo] = useState("");
    const [humrug_uurchlult, setUurchlulut] = useState("");
    const [uurchlult_ognoo, setUurOgnoo] = useState("");
    const [humrug_tailbar, setTailbar] = useState("");

    const [getDataRow, setDataRow] = useState([]);
    const [getHumrug, setHumrug] = useState([]);

    useEffect(() => {
        axios
            .get("/get/humrugType")
            .then((res) => {
                setHumrug(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setDataRow(props.changeDataRow);
    }, [props.changeDataRow]);

    useEffect(() => {
        if (props.isEditBtnClick && props.changeDataRow) {
            setHumrugDugaar(props.changeDataRow.humrug_dugaar);
            setHumrugNer(props.changeDataRow.humrug_ner);
            setHumrugZereglel(props.changeDataRow.humrug_zereglel);

            // ⭐ ЭНЭ ХЭСЭГ ЧУХАЛ
            setOgnoo(
                props.changeDataRow.anhnii_ognoo
                    ? props.changeDataRow.anhnii_ognoo.split(" ")[0]
                    : ""
            );

            setUurchlulut(props.changeDataRow.humrug_uurchlult ?? "");
            setUurOgnoo(
                props.changeDataRow.uurchlult_ognoo
                    ? props.changeDataRow.uurchlult_ognoo.split(" ")[0]
                    : ""
            );
            setTailbar(props.changeDataRow.humrug_tailbar ?? "");
        }
    }, [props.isEditBtnClick]);

    const saveComand = () => {
        props.setRowsSelected([]);
        if (humrug_dugaar == "" || humrug_dugaar == null) {
            Swal.fire("Хөмрөг дугаар оруулна уу");
            return;
        }
        if (humrug_ner == "" || humrug_ner == null) {
            Swal.fire("Хөмрөг нэр оруулна уу");
            return;
        }
        if (humrug_zereglel == "" || humrug_zereglel == null) {
            Swal.fire("Хөмрөг зэрэглэл оруулна уу.");
            return;
        }

        axios
            .post("/edit/humrug", {
                id: props.changeDataRow.id,
                humrug_dugaar: humrug_dugaar,
                humrug_ner: humrug_ner,
                humrug_zereglel: humrug_zereglel,
                anhnii_ognoo: anhnii_ognoo,
                humrug_uurchlult: humrug_uurchlult,
                uurchlult_ognoo: uurchlult_ognoo,
                humrug_tailbar: humrug_tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                setHumrugDugaar("");
                setHumrugNer("");
                setHumrugZereglel("");
                setOgnoo("");
                setUurchlulut("");
                setUurOgnoo("");
                setTailbar("");
                if (window.$) {
                    window.$("#humrugedit").modal("hide");
                }

                props.refreshHumrug();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeHumrugDugaar = (e) => {
        setHumrugDugaar(e.target.value);
    };
    const changeHumrugNer = (e) => {
        setHumrugNer(e.target.value);
    };
    const changeHumrugZereglel = (e) => {
        setHumrugZereglel(e.target.value);
    };

    const changeOgnoo = (e) => {
        setOgnoo(e.target.value);
    };
    const changeUurchlult = (e) => {
        setUurchlulut(e.target.value);
    };
    const changeUurOgnoo = (e) => {
        setUurOgnoo(e.target.value);
    };
    const changeTailbar = (e) => {
        setTailbar(e.target.value);
    };

    return (
        <>
            <div className="modal" id="humrugedit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">ХӨМРӨГ ЗАСАХ</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* <div className="row">
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
                            </div> */}

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хөмрөг дугаар:
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            onChange={changeHumrugDugaar}
                                            value={humrug_dugaar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хөмрөгийн нэр:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHumrugNer}
                                            value={humrug_ner}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хөмрөгийн зэрэглэл:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeHumrugZereglel}
                                            value={humrug_zereglel}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Архивт анх баримт шилжүүлсэн
                                                огноо:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeOgnoo}
                                            value={anhnii_ognoo}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хөмрөгийн өөрчлөлт:
                                            </span>
                                        </div>
                                        <select
                                            className="form-control"
                                            onChange={changeUurchlult}
                                            value={humrug_uurchlult}
                                        >
                                            <option value="">Сонгоно уу</option>
                                            {getHumrug.map((el) => (
                                                <option
                                                    key={el.id}
                                                    value={el.HumName}
                                                >
                                                    {el.HumName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Өөрчлөлт хийсэн огноо:
                                            </span>
                                        </div>

                                        <input
                                            className="form-control"
                                            onChange={changeUurOgnoo}
                                            value={uurchlult_ognoo}
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
                                        value={humrug_tailbar}
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

export default HumrugEdit;
