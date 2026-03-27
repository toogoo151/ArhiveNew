import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const NomNew = ({ refreshNom }) => {

    const [humrugList, setHumrugList] = useState([]);
    const [dansList, setDansList] = useState([]);

    // ================= FORM =================
    const schema = Yup.object().shape({
        humrug_id: Yup.string().required("Хөмрөг сонгоно уу"),
        // dans_id: Yup.string().required("Данс сонгоно уу"),

    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    // ================= FETCH DATA =================
    useEffect(() => {
        axios.get("/get/Humrug").then(res => {
            setHumrugList(res.data);
        });

        axios.get("/get/Dans").then(res => {
            setDansList(res.data);
        });
    }, []);

    // ================= WATCH =================
    const selectedHumrugId = watch("humrug_id");
    const selectedDansId = watch("dans_id");

    // ================= FILTER DANS =================
    const filteredDans = dansList.filter(
        d => String(d.humrugID) == selectedHumrugId
    );

    // Reset dans when humrug changes
    useEffect(() => {
        setValue("dans_id", "");
    }, [selectedHumrugId]);

    // ================= SUBMIT =================
    const onSubmit = (data) => {
        axios.post("/new/ashignom", data)
            .then(res => {
                Swal.fire(res.data.msg);
                reset();
                refreshNom();
            })
            .catch(err => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    return (
        <div className="modal" id="NomNew">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h4 className="modal-title">Ном нэмэх</h4>
                        <button className="close" data-dismiss="modal">×</button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">

                            {/* ================= HUMRUG ================= */}
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Хөмрөгийн дугаар</label>
                                    <select
                                        className="form-control"
                                        {...register("humrug_id")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {humrugList.map(h => (
                                            <option key={h.id} value={h.id}>
                                                {h.humrug_dugaar}-{h.humrug_ner}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label>Хөмрөгийн нэр</label>
                                    <input
                                        className="form-control"
                                        disabled
                                        value={
                                            humrugList.find(
                                                h => h.id == selectedHumrugId
                                            )?.humrug_ner || ""
                                        }
                                    />
                                </div>
                            </div>

                            {/* ================= DANS ================= */}
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>Дансны дугаар</label>
                                    <select
                                        className="form-control"
                                        {...register("dans_id")}
                                        disabled={!selectedHumrugId}
                                    >
                                        <option value="">
                                            {selectedHumrugId
                                                ? "Сонгоно уу"
                                                : "Эхлээд хөмрөг сонгоно уу"}
                                        </option>

                                        {filteredDans.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.dans_dugaar}-{d.dans_ner}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label>Дансны нэр</label>
                                    <input
                                        className="form-control"
                                        disabled
                                        value={
                                            dansList.find(
                                                d => d.id == selectedDansId
                                            )?.dans_ner || ""
                                        }
                                    />
                                </div>
                            </div>

                                {/* ================= NOM ================= */}
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label>Номын дугаар</label>
                                    <input
                                        className="form-control"
                                        {...register("nom_dugaar")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Номын нэр</label>
                                    <input
                                        className="form-control"
                                        {...register("tailal")}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-success" type="submit">
                                Нэмэх
                            </button>
                            <button
                                className="btn btn-danger"
                                data-dismiss="modal"
                                type="button"
                            >
                                Хаах
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default NomNew;
