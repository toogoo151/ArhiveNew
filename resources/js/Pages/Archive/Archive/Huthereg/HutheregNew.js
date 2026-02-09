import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const HutheregNew = (props) => {
    const formSchema = Yup.object().shape({
        ognoo: Yup.string().required("Он оруулна уу"),
        des_dugaar: Yup.string().required("Дэс дугаар оруулна уу"),
        indeks: Yup.string().required("Индекс оруулна уу"),
        garchig: Yup.string().required("Гарчиг оруулна уу"),
        hugatsaa: Yup.string().required("Хугацаа оруулна уу"),
        alban_tushaal: Yup.string().required("Албан тушаал оруулна уу"),
        tailbar: Yup.string().nullable(),
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
            .post("/new/huthereg", {
                ognoo: data.ognoo,
                des_dugaar: data.des_dugaar,
                indeks: data.indeks,
                garchig: data.garchig,
                hugatsaa: data.hugatsaa,
                alban_tushaal: data.alban_tushaal,
                tailbar: data.tailbar,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        ognoo: "",
                        des_dugaar: "",
                        indeks: "",
                        garchig: "",
                        hugatsaa: "",
                        alban_tushaal: "",
                        tailbar: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshHuthereg();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="hutheregNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                {" "}
                                ХӨТЛӨХ ХЭРГИЙН ЖАГСААЛТ НЭМЭХ
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
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Он:
                                            </span>
                                        </div>

                                        <input
                                            type="date"
                                            {...register("ognoo")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.ognoo?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Дэс дугаар:
                                            </span>
                                        </div>
                                        <input
                                            {...register("des_dugaar")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.des_dugaar?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэргийн индекс:
                                            </span>
                                        </div>
                                        <input
                                            {...register("indeks")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.indeks?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хэргийн агуулга, гарчиг:
                                            </span>
                                        </div>
                                        <input
                                            {...register("garchig")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.garchig?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хадгалах хугацааны жагсаалтын
                                                зүйлийн дугаар, хадгалах
                                                хугацаа:
                                            </span>
                                        </div>
                                        <input
                                            {...register("hugatsaa")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.hugatsaa?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Хариуцах албан тушаалтан:
                                            </span>
                                        </div>
                                        <input
                                            {...register("alban_tushaal")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.alban_tushaal?.message}
                                    </p>
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
                                    <p className="alerts">
                                        {errors.tailbar?.message}
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

export default HutheregNew;
