import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const DansBurtgelNew = ({ refreshDans, selectedHumrug, selectedRetention }) => {
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

    const filteredSecType = getSecType.filter((el) => {
        const name = el.Sname?.trim().toLowerCase();

        // Байнга эсвэл Түр
        if (
            selectedRetention === "Байнга хадгалагдах" ||
            selectedRetention === "Түр хадгалагдах"
        ) {
            return name === "илт" || name === "нууц";
        }

        // 70 жил
        if (selectedRetention === "70 жил хадгалагдах") {
            return name === "хүний нөөц" || name === "санхүү";
        }

        return false;
    });
    useEffect(() => {
        setValue("dans_baidal", "");
    }, [selectedRetention]);

    // ===============================
    // 🔥 MODAL НЭЭГДЭХ ҮЕД ШАЛГАХ
    // ===============================
    useEffect(() => {
        const modalEl = document.getElementById("dansNew");
        if (!modalEl) return;

        const handleShow = () => {
            if (selectedHumrug === 0 || selectedRetention === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Анхааруулга",
                    text: "Хөмрөг болон хадгалах хугацааг сонгоно уу!",
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
    }, [selectedHumrug, selectedRetention]);

    const formSchema = Yup.object().shape({
        dans_baidal: Yup.string().required("Нууцын зэрэг сонгоно уу"),
        dans_dugaar: Yup.string().required("Дансны дугаар оруулна уу"),
        dans_ner: Yup.string().required("Дансны нэр оруулна уу"),
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
        axios
            .post("/new/dans", {
                humrugID: selectedHumrug,
                hadgalah_hugatsaa: selectedRetention,
                dans_baidal: data.dans_baidal,
                dans_dugaar: data.dans_dugaar,
                dans_ner: data.dans_ner,
                humrug_niit: data.humrug_niit,
                dans_niit: data.dans_niit,
                on_ehen: data.on_ehen,
                on_suul: data.on_suul,
                hubi_dans: data.hubi_dans,
                dans_tailbar: data.dans_tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        dans_baidal: "",
                        dans_dugaar: "",
                        dans_ner: "",
                        humrug_niit: "",
                        dans_niit: "",
                        on_ehen: "",
                        on_suul: "",
                        hubi_dans: "",
                        dans_tailbar: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                refreshDans();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="dansNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title"> ДАНС БҮРТГЭЛ НЭМЭХ</h4>

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
                                                    Нууцын зэрэг:
                                                </span>
                                            </div>

                                            <select
                                                className="form-control"
                                                {...register("dans_baidal")}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>

                                                {filteredSecType.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.Sname}
                                                    >
                                                        {el.Sname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.dans_baidal?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хөмрөгийн нийт ХН:
                                                </span>
                                            </div>
                                            <input
                                                {...register("humrug_niit")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.humrug_niit?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Дансны дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("dans_dugaar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.dans_dugaar?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Дансны нэр:
                                                </span>
                                            </div>
                                            <input
                                                {...register("dans_ner")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.dans_ner?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row clearfix">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Оны хязгаар эхэн:
                                                </span>
                                            </div>
                                            <input
                                                {...register("on_ehen")}
                                                className="form-control"
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
                                                {...register("on_suul")}
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
                                                    Тухайн дансны ХН:
                                                </span>
                                            </div>
                                            <input
                                                {...register("dans_niit")}
                                                className="form-control"
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
                                                {...register("hubi_dans")}
                                                className="form-control"
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
                                            {...register("dans_tailbar")}
                                            className="form-control"
                                        />
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

export default DansBurtgelNew;
