import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const AngiNew = (props) => {
    const [getComandlal, setComandlal] = useState([]);

    useEffect(() => {
        axios
            .get("/get/comandlal")
            .then((res) => {
                setComandlal(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const formSchema = Yup.object().shape({
        comand_id: Yup.string().required("Командлалаа сонгоно уу."),
        idangi: Yup.string().required("Ангийн дугаар оруулна уу."),
        ner: Yup.string().required("Ангийн нэр оруулна уу."),
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
            .post("/new/angi", {
                comand_id: data.comand_id,
                idangi: data.idangi,
                ner: data.ner,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        comand_id: "",
                        idangi: "",
                        ner: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshAngi();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="angiNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">АНГИ НЭМЭХ</h4>

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
                                                Командлалын нэр:
                                            </span>
                                        </div>
                                        <select
                                            className="form-control"
                                            {...register("comand_id")}
                                        >
                                            <option value="0">
                                                Сонгоно уу
                                            </option>
                                            {getComandlal.map((el) => (
                                                <option
                                                    key={el.id}
                                                    value={el.id}
                                                >
                                                    {el.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="alerts">
                                        {errors.comand_id?.message}
                                    </p>
                                </div>

                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Ангийн дугаар:
                                            </span>
                                        </div>
                                        <input
                                            {...register("idangi")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.idangi?.message}
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Ангийн нэр:
                                            </span>
                                        </div>
                                        <input
                                            {...register("ner")}
                                            className="form-control"
                                        />
                                    </div>
                                    <p className="alerts">
                                        {errors.ner?.message}
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

export default AngiNew;
