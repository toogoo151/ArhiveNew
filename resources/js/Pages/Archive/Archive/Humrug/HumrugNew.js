import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const HumrugNew = (props) => {
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
    const formSchema = Yup.object().shape({
        humrug_dugaar: Yup.string().required("Хөмрөг дугаар оруулна уу"),
        humrug_ner: Yup.string().required("Хөмрөгийн нэр оруулна уу"),
        humrug_zereglel: Yup.string().required("Хөмрөгийн зэрэглэл оруулна уу"),
        anhnii_ognoo: Yup.string().nullable(),
        humrug_uurchlult: Yup.string().nullable(),
        uurchlult_ognoo: Yup.string().nullable(),
        humrug_tailbar: Yup.string().nullable(),
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
            .post("/new/humrug", {
                humrug_dugaar: data.humrug_dugaar,
                humrug_ner: data.humrug_ner,
                humrug_zereglel: data.humrug_zereglel,
                anhnii_ognoo: data.anhnii_ognoo,
                humrug_uurchlult: data.humrug_uurchlult,
                uurchlult_ognoo: data.uurchlult_ognoo,
                humrug_tailbar: data.humrug_tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        humrug_dugaar: "",
                        humrug_ner: "",
                        humrug_zereglel: "",
                        anhnii_ognoo: "",
                        humrug_uurchlult: "",
                        uurchlult_ognoo: "",
                        humrug_tailbar: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshHumrug();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="humrugNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title"> ХӨМРӨГ НЭМЭХ</h4>

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
                                                    Хөмрөг дугаар:
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                {...register("humrug_dugaar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.humrug_dugaar?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хөмрөгийн нэр:
                                                </span>
                                            </div>
                                            <input
                                                {...register("humrug_ner")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.humrug_ner?.message}
                                        </p>
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
                                                {...register("humrug_zereglel")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.humrug_zereglel?.message}
                                        </p>
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
                                                {...register("anhnii_ognoo")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.anhnii_ognoo?.message}
                                        </p>
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
                                                {...register(
                                                    "humrug_uurchlult"
                                                )}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
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
                                        <p className="alerts">
                                            {errors.humrug_uurchlult?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Өөрчлөлт хийсэн огноо:
                                                </span>
                                            </div>
                                            <input
                                                {...register("uurchlult_ognoo")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.uurchlult_ognoo?.message}
                                        </p>
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
                                            {...register("humrug_tailbar")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.humrug_tailbar?.message}
                                    </p>
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

export default HumrugNew;
