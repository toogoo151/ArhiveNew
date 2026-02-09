import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const ComandlalNew = (props) => {
    const formSchema = Yup.object().shape({
        name: Yup.string().required("Нэр оруулна уу."),
        ShortName: Yup.string().required("Товч нэр оруулна уу."),
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
            .post("/new/comandlal", {
                name: data.name,
                ShortName: data.ShortName,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        name: "",
                        ShortName: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshComandlal();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="comandlalNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">КОМАНДЛАЛ НЭМЭХ</h4>

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
                                                Нэр:
                                            </span>
                                        </div>
                                        <input
                                            {...register("name")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.name?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Товч нэр:
                                            </span>
                                        </div>
                                        <input
                                            {...register("ShortName")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.ShortName?.message}
                                    </p>
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="modal-footer">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    data-dismiss=""
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

export default ComandlalNew;
