import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const BaingaNuutsNew = ({
    refreshBaingaNuuts,
    selectedHumrug,
    selectedDans,
}) => {
    // 🔥 MODAL НЭЭГДЭХ ҮЕД ШАЛГАХ
    // ===============================
    useEffect(() => {
        const modalEl = document.getElementById("BaingaNuutsNew");
        if (!modalEl) return;

        const handleShow = () => {
            if (selectedHumrug === 0 || selectedDans === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Анхааруулга",
                    text: "Хөмрөг болон дансны дугаар сонгоно уу!",
                });

                const modal =
                    window.bootstrap.Modal.getInstance(modalEl) ||
                    new window.bootstrap.Modal(modalEl);

                modal.hide();
            }
        };

        modalEl.addEventListener("shown.bs.modal", handleShow);

        return () => {
            modalEl.removeEventListener("shown.bs.modal", handleShow);
        };
    }, [selectedHumrug, selectedDans]);

    const formSchema = Yup.object().shape({
        hn_tailbar: Yup.string().nullable(),
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

    const onEhen = watch("on_ehen");
    useEffect(() => {
        if (onEhen) {
            const year = new Date(onEhen).getFullYear();
            setValue("harya_on", year.toString());
        }
    }, [onEhen, setValue]);

    const onSubmit = (data) => {
        axios
            .post("/new/BaingaNuuts", {
                humrug_id: selectedHumrug,
                dans_id: selectedDans,
                hn_dd: data.hn_dd,
                hn_zbn: data.hn_zbn,
                hereg_burgtel: data.hereg_burgtel,
                hn_garchig: data.hn_garchig,
                nuuts_zereglel: data.nuuts_zereglel,
                harya_on: data.harya_on,
                on_ehen: data.on_ehen,
                on_suul: data.on_suul,
                huudas_too: data.huudas_too,
                habsralt_too: data.habsralt_too,
                jagsaalt_zuildugaar: data.jagsaalt_zuildugaar,
                hn_tailbar: data.hn_tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        hn_dd: "",
                        hn_zbn: "",
                        hereg_burgtel: "",
                        hn_garchig: "",
                        nuuts_zereglel: "",
                        hn_garchig: "",
                        nuuts_zereglel: "",
                        harya_on: "",
                        on_ehen: "",
                        on_suul: "",
                        huudas_too: "",
                        habsralt_too: "",
                        jagsaalt_zuildugaar: "",
                        hn_tailbar: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                refreshBaingaNuuts();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="BaingaNuutsNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                {" "}
                                ХАДГАЛАМЖИЙН НЭГЖ НЭМЭХ{" "}
                            </h4>

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
                                                    Дугаар:
                                                </span>
                                            </div>

                                            <input
                                                type="number"
                                                {...register("hn_dd", {
                                                    valueAsNumber: true,
                                                })}
                                                className="form-control"
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
                                                {...register("hn_zbn")}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хэрэг,данс бүртгэл:
                                                </span>
                                            </div>
                                            <input
                                                {...register("hereg_burgtel")}
                                                className="form-control"
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
                                                {...register("harya_on")}
                                                className="form-control"
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
                                                    Хэрэг данс бүртгэлийн нэр:
                                                </span>
                                            </div>
                                            <input
                                                {...register("hn_garchig")}
                                                className="form-control"
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
                                                {...register("nuuts_zereglel")}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row clearfix">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Эхэлсэн он:
                                                </span>
                                            </div>
                                            <input
                                                type="date"
                                                {...register("on_ehen")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.on_ehen?.message}
                                        </p>
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
                                                {...register("on_suul")}
                                                className="form-control"
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
                                                {...register("habsralt_too", {
                                                    valueAsNumber: true,
                                                })}
                                                className="form-control"
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
                                                {...register("huudas_too", {
                                                    valueAsNumber: true,
                                                })}
                                                className="form-control"
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
                                                                .$(
                                                                    "#HadHugatsaa"
                                                                )
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
                                                {...register(
                                                    "jagsaalt_zuildugaar"
                                                )}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts"></p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Тайлбар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("hn_tailbar")}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
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

export default BaingaNuutsNew;
