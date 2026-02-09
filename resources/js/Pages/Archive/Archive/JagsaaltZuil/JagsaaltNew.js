import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const JagsaaltNew = (props) => {
    // const [getHumrug, setHumrug] = useState([]);
    const [getJagsaalt, setJagsaalt] = useState([]);
    const [getHugatsaaTurul, setHugatsaaTurul] = useState([]);

    useEffect(() => {
        axios
            .get("/get/jagsaaltTurul")
            .then((res) => {
                setJagsaalt(res.data);
            })
            .catch((err) => {});

        axios
            .get("/get/hugatsaaTurul")
            .then((res) => {
                setHugatsaaTurul(res.data);
            })
            .catch((err) => {});
    }, []);

    const formSchema = Yup.object().shape({
        barimt_ner: Yup.string().required("Хөмрөг дугаар оруулна уу"),
        // humrug_ner: Yup.string().required("Хөмрөгийн нэр оруулна уу"),
        // humrug_zereglel: Yup.string().required("Хөмрөгийн зэрэглэл оруулна уу"),
        // anhnii_ognoo: Yup.string().required("Анхны огноо оруулна уу"),
        // humrug_uurchlult: Yup.string().nullable(),
        // uurchlult_ognoo: Yup.string().nullable(),
        // humrug_tailbar: Yup.string().nullable(),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
        setValue,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema),
    });

    const onSubmit = (data) => {
        const selectedJagsaalt = getJagsaalt.find(
            (el) => String(el.id) === String(data.jagsaalt_turul)
        );
        axios
            .post("/new/jagsaalt", {
                // Save text (jName) but keep dropdown working with id
                jagsaalt_turul: selectedJagsaalt?.jName ?? data.jagsaalt_turul,
                barimt_dd: data.barimt_dd,
                barimt_turul: data.barimt_turul,
                barimt_dedturul: data.barimt_dedturul,
                barimt_ner: data.barimt_ner,
                hugatsaa_turul: data.hugatsaa_turul,
                hugatsaa: data.hugatsaa,
                tailbar: data.tailbar,
                tobchlol: data.tobchlol,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        jagsaalt_turul: "",
                        barimt_dd: "",
                        barimt_turul: "",
                        barimt_dedturul: "",
                        barimt_ner: "",
                        hugatsaa_turul: "",
                        hugatsaa: "",
                        tailbar: "",
                        tobchlol: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshJagsaalt();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeDateType = (e) => {
        const selectedId = e.target.value;

        if (!selectedId || selectedId === "0") {
            setValue("hugatsaa", "");
            updateTobchlol();
            return;
        }

        const selected = getHugatsaaTurul.find(
            (el) => String(el.id) === String(selectedId)
        );

        if (!selected) return;

        let hugatsaaValue = "";

        switch (selected.RetName) {
            case "Байнга хадгалагдах":
                hugatsaaValue = "Байнга";
                break;

            case "70 жил хадгалагдах":
                hugatsaaValue = "70 жил";
                break;

            case "Түр хадгалагдах":
                hugatsaaValue = "Жил";
                break;

            default:
                hugatsaaValue = "";
        }

        setValue("hugatsaa", hugatsaaValue);
        updateTobchlol();
    };

    const updateTobchlol = () => {
        const jagsaaltId = watch("jagsaalt_turul");
        const retentionId = watch("hugatsaa_turul");

        if (!jagsaaltId || jagsaaltId === "0" || !retentionId || retentionId === "0") {
            setValue("tobchlol", "");
            return;
        }

        const selectedJagsaalt = getJagsaalt.find(
            (el) => String(el.id) === String(jagsaaltId)
        );

        const selectedRetention = getHugatsaaTurul.find(
            (el) => String(el.id) === String(retentionId)
        );

        if (!selectedJagsaalt || !selectedRetention) {
            setValue("tobchlol", "");
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
        let retentionValue = "";
        if (selectedRetention.RetName.includes("Байнга")) {
            retentionValue = "Байнга";
        } else if (selectedRetention.RetName.includes("70 жил")) {
            retentionValue = "70 жил";
        } else if (selectedRetention.RetName.includes("Түр")) {
            retentionValue = "жил";
        }

        // Combine and set tobchlol
        if (jagsaaltAbbrev && retentionValue) {
            setValue("tobchlol", `${jagsaaltAbbrev}-${retentionValue}`);
        } else {
            setValue("tobchlol", "");
        }
    };

    const changeJagsaaltType = (e) => {
        updateTobchlol();
    };

    const TimeOptions = [
        {  bainga: "Байнга" },
        {  dalanJil: "70 жил" },
        {  jil: "Жил" },
    ];

    const TovchlolOptions = [
        {  VJbainga: "ҮЖ--Байнга" },
        {  VJdalanJil: "ҮЖ--70 жил" },
        {  VJjil: "ҮЖ--Жил" },
        {  SJbainga: "СЖ--Байнга" },
        {  SJdalanJil: "СЖ--70 жил" },
        {  SJjil: "СЖ--Жил" },
        {  BJbainga: "БЖ--Байнга" },
        {  BJdalanJil: "БЖ--70 жил" },
        {  BJjil: "БЖ--Жил" },
    ];


    return (
        <>
            <div className="modal" id="jagsaaltNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title"> Жагсаалт нэмэх</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                                {...register("jagsaalt_turul", {
                                                    onChange: changeJagsaaltType,
                                                })}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {getJagsaalt.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.jName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.jagsaalt_turul?.message}
                                        </p> */}
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                   Баримтын төрөл:
                                                </span>
                                            </div>
                                            <input
                                                {...register("barimt_turul")}
                                                className="form-control"
                                            />
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.barimt_turul?.message}
                                        </p> */}
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
                                                {...register("barimt_dedturul")}
                                                className="form-control"
                                            />
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.barimt_dedturul?.message}
                                        </p> */}
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                   Дэс дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("barimt_dd")}
                                                className="form-control"
                                            />
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.barimt_dd?.message}
                                        </p> */}
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
                                                {...register("barimt_ner")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.barimt_ner?.message}
                                        </p>
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
                                                // {...register(
                                                //     "hugatsaa_turul"
                                                // )}
                                                // onChange={changeDateType}
                                                {...register("hugatsaa_turul", {
                                                    onChange: changeDateType,
                                                })}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {getHugatsaaTurul.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.RetName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.hugatsaa_turul?.message}
                                        </p> */}
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
                                                {...register("hugatsaa")}
                                                className="form-control"
                                                // readOnly
                                            />
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.hugatsaa?.message}
                                        </p> */}
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Товчлол:
                                                </span>
                                            </div>
                                            <input
                                                {...register("tobchlol")}
                                                className="form-control"
                                                // readOnly
                                            />
                                        </div>
                                        {/* <p className="alerts">
                                            {errors.tobchlol?.message}
                                        </p> */}
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
                                            {...register("tailbar")}
                                            className="form-control"
                                        />
                                    </div>
                                    {/* <p className="alerts">
                                        {errors.tailbar?.message}
                                    </p> */}
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="modal-footer">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Нэмэх
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
        </>
    );
};

export default JagsaaltNew;
