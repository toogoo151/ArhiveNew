import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const NomEdit = ({
    refreshNom,
    setRowsSelected,
    changeDataRow,
    isEditBtnClick,
    editRequestId
}) => {

    const [humrugList, setHumrugList] = useState([]);
    const [dansList, setDansList] = useState([]);
    const [isDansInitialized, setIsDansInitialized] = useState(false);
    const openModalTimeoutRef = useRef(null);
    const lastHandledEditRequestIdRef = useRef(0);


    // ================= FORM =================
    const schema = Yup.object().shape({
        humrug_id: Yup.string().required("Хөмрөг сонгоно уу"),

    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            humrug_id: "",
            dans_id: "",
            nom_dugaar: "",
            nom_ners: "",
        },
    });

    // ================= FETCH =================
    useEffect(() => {
        axios.get("/get/Humrug").then(res => setHumrugList(res.data));
        axios.get("/get/Dans").then(res => setDansList(res.data));
    }, []);

    // ================= WATCH =================
    const selectedHumrugId = watch("humrug_id");
    const selectedDansId = watch("dans_id");

    // ================= FILTER DANS =================
    const filteredDans = dansList.filter(
        d => String(d.humrugID) === String(selectedHumrugId)
    );

    // ================= LOAD EDIT DATA =================
    useEffect(() => {
        if (!editRequestId) return;
        if (editRequestId === lastHandledEditRequestIdRef.current) return;
        lastHandledEditRequestIdRef.current = editRequestId;
        if (!changeDataRow?.id) return;

        setIsDansInitialized(false);

        // Set values first...
        reset({
            humrug_id: String(changeDataRow.humrug_id ?? ""),
            dans_id: String(changeDataRow.dans_id ?? ""),
            nom_dugaar: changeDataRow.nom_dugaar ?? "",
            nom_ners: changeDataRow.nom_ners ?? "",
        });

        // ...then open modal on next tick to avoid "double click" / empty first paint.
        if (openModalTimeoutRef.current) {
            clearTimeout(openModalTimeoutRef.current);
        }
        openModalTimeoutRef.current = setTimeout(() => {
            if (window.$) {
                window.$("#NomEdit").modal("show");
            }
        }, 0);
    }, [editRequestId, changeDataRow, reset]);

    useEffect(() => {
        return () => {
            if (openModalTimeoutRef.current) {
                clearTimeout(openModalTimeoutRef.current);
            }
        };
    }, []);


    // ================= RESET DANS ON HUMRUG CHANGE =================
useEffect(() => {
    if (
        !isDansInitialized &&
        changeDataRow &&
        selectedHumrugId &&
        filteredDans.length > 0
    ) {
        setValue("dans_id", changeDataRow.dans_id);
        setIsDansInitialized(true);
    }
}, [selectedHumrugId, filteredDans]);


    // ================= SUBMIT =================
    const onSubmit = (data) => {
        axios.post("/edit/ashignom", {
            id: changeDataRow.id,
            ...data
        })

        .then(res => {
            Swal.fire(res.data.msg);
            reset();

            window.$("#NomEdit").modal("hide");
            setRowsSelected([]);
            refreshNom();
        })
        .catch(err => {
            Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
        });
    };

    return (
        <div className="modal" id="NomEdit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Ном засах</h4>
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
                                    {errors.humrug_id && (
                                        <small className="text-danger">
                                            {errors.humrug_id.message}
                                        </small>
                                    )}
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

                            {/* ================= Nom ================ */}
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
                                        {...register("nom_ners")}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-success" type="submit">
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NomEdit;
