import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const SalbarNew = (props) => {
    const [getComandlal, setComandlal] = useState([]);
    const [getUnits, setUnit] = useState([]);

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
        angi: Yup.string().required("Ангийн нэр оруулна уу."),
        salbar: Yup.string().required("Салбарын нэр оруулна уу."),
        t_ner: Yup.string().required("Товч нэр оруулна уу."),
        b_ner: Yup.string().required("Бүтэн нэр оруулна уу."),
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
            .post("/new/salbar", {
                comand_id: data.comand_id,
                angi: data.angi,
                salbar: data.salbar,
                t_ner: data.t_ner,
                b_ner: data.b_ner,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        comand_id: "",
                        angi: "",
                        salbar: "",
                        t_ner: "",
                        b_ner: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshSalbar();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeComandlal = (e) => {
        axios
            .post("/get/angi/byComandlalID", {
                id: e.target.value,
            })
            .then((res) => {
                setUnit(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="modal" id="salbarNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">САЛБАР НЭМЭХ</h4>

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
                                {/* <div className="row">
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
                                </div> */}
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Командлал:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-star"></i>
                                                </span>
                                            </div>
                                            <select
                                                className="form-control"
                                                {...register("comand_id")}
                                                onChange={changeComandlal}
                                            >
                                                <option value="">
                                                    Сонгоно уу
                                                </option>
                                                {getComandlal.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.ShortName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.comand_id?.message}
                                        </p>
                                    </div>
                                </div>
                                {getUnits.length > 0 && (
                                    <div className="row">
                                        <div className="col-md-3 float-righ">
                                            <label className="float-righ">
                                                Анги:
                                            </label>
                                        </div>
                                        <div className="col-md-9">
                                            <Select
                                                options={getUnits.map(
                                                    (unit) => ({
                                                        value: unit.id,
                                                        label: unit.ner,
                                                    })
                                                )}
                                                value={
                                                    getUnits
                                                        .filter(
                                                            (unit) =>
                                                                unit.id ===
                                                                getValues(
                                                                    "angi"
                                                                )
                                                        )
                                                        .map((unit) => ({
                                                            value: unit.id,
                                                            label: unit.ner,
                                                        }))[0]
                                                }
                                                onChange={(selectedOption) =>
                                                    setValue(
                                                        "angi",
                                                        selectedOption
                                                            ? selectedOption.value
                                                            : ""
                                                    )
                                                }
                                                placeholder="Сонгоно уу"
                                                isSearchable={true}
                                            />
                                            <p className="alerts">
                                                {errors.angi?.message}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Салбар:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-star"></i>
                                                </span>
                                            </div>
                                            <input
                                                {...register("salbar", {
                                                    required: true,
                                                    // maxLength: 20,
                                                })}
                                                className="form-control"
                                                placeholder="Салбарын "
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.salbar?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Товч нэр:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-star"></i>
                                                </span>
                                            </div>
                                            <input
                                                {...register("t_ner", {
                                                    required: true,
                                                    // maxLength: 20,
                                                })}
                                                className="form-control"
                                                placeholder="Товч нэр оруулна уу "
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.t_ner?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Бүтэн нэр:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-star"></i>
                                                </span>
                                            </div>
                                            <input
                                                {...register("b_ner", {
                                                    required: true,
                                                    // maxLength: 20,
                                                })}
                                                className="form-control"
                                                placeholder="Салбарын нэр бүтэн оруулна уу"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.b_ner?.message}
                                        </p>
                                    </div>
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

export default SalbarNew;
