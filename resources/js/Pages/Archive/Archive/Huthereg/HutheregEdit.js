import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const HutheregEdit = (props) => {
    const [ognoo, setOgnoo] = useState("");
    const [des_dugaar, setDesdugaar] = useState("");
    const [indeks, setIndeks] = useState("");
    const [garchig, setGarchig] = useState("");
    const [hugatsaa, setHugatsaa] = useState("");
    const [alban_tushaal, setAlbantushaal] = useState("");
    const [tailbar, setTailbar] = useState("");

    useEffect(() => {
        if (props.isEditBtnClick && props.changeDataRow) {
            const rawDate = props.changeDataRow.ognoo;

            let formattedDate = "";
            if (rawDate) {
                const d = new Date(rawDate);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");

                formattedDate = `${year}-${month}-${day}`;
            }

            setOgnoo(formattedDate);

            setDesdugaar(props.changeDataRow.des_dugaar || "");
            setIndeks(props.changeDataRow.indeks || "");
            setGarchig(props.changeDataRow.garchig || "");
            setHugatsaa(props.changeDataRow.hugatsaa || "");
            setAlbantushaal(props.changeDataRow.alban_tushaal || "");
            setTailbar(props.changeDataRow.tailbar || "");
        }
    }, [props.isEditBtnClick, props.changeDataRow]);

    const saveHuthereg = () => {
        props.setRowsSelected([]);

        if (!ognoo) return Swal.fire("Он оруулна уу");
        if (!des_dugaar) return Swal.fire("Дэс дугаар оруулна уу");
        if (!indeks) return Swal.fire("Индекс оруулна уу");
        if (!garchig) return Swal.fire("Гарчиг оруулна уу");
        if (!hugatsaa) return Swal.fire("Хугацаа оруулна уу");
        if (!alban_tushaal) return Swal.fire("Албан тушаал оруулна уу");

        axios
            .post("/edit/huthereg", {
                id: props.changeDataRow.id,
                ognoo,
                des_dugaar,
                indeks,
                garchig,
                hugatsaa,
                alban_tushaal,
                tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);

                // reset
                setOgnoo("");
                setDesdugaar("");
                setIndeks("");
                setGarchig("");
                setHugatsaa("");
                setAlbantushaal("");
                setTailbar("");

                if (window.$) {
                    window.$("#hutheregEdit").modal("hide");
                }

                props.refreshHuthereg();
            })
            .catch((err) => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    return (
        <div className="modal fade" id="hutheregEdit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">
                            ХӨТЛӨХ ХЭРГИЙН ЖАГСААЛТ ЗАСАХ
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
                        {/* Он */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Он:</span>
                            </div>
                            <input
                                type="date"
                                className="form-control"
                                value={ognoo || ""}
                                onChange={(e) => setOgnoo(e.target.value)}
                            />
                        </div>

                        {/* Дэс дугаар */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Дэс дугаар:
                                </span>
                            </div>
                            <input
                                className="form-control"
                                value={des_dugaar}
                                onChange={(e) => setDesdugaar(e.target.value)}
                            />
                        </div>

                        {/* Индекс */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Хэргийн индекс:
                                </span>
                            </div>
                            <input
                                className="form-control"
                                value={indeks}
                                onChange={(e) => setIndeks(e.target.value)}
                            />
                        </div>

                        {/* Гарчиг */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Хэргийн агуулга, гарчиг:
                                </span>
                            </div>
                            <input
                                className="form-control"
                                value={garchig}
                                onChange={(e) => setGarchig(e.target.value)}
                            />
                        </div>

                        {/* Хугацаа */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Хадгалах хугацаа:
                                </span>
                            </div>
                            <input
                                className="form-control"
                                value={hugatsaa}
                                onChange={(e) => setHugatsaa(e.target.value)}
                            />
                        </div>

                        {/* Албан тушаал */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Хариуцах албан тушаалтан:
                                </span>
                            </div>
                            <input
                                className="form-control"
                                value={alban_tushaal}
                                onChange={(e) =>
                                    setAlbantushaal(e.target.value)
                                }
                            />
                        </div>

                        {/* Тайлбар */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Тайлбар:
                                </span>
                            </div>
                            <input
                                className="form-control"
                                value={tailbar}
                                onChange={(e) => setTailbar(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-success"
                            onClick={saveHuthereg}
                        >
                            Засах
                        </button>
                        <button className="btn btn-danger" data-dismiss="modal">
                            Хаах
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HutheregEdit;
