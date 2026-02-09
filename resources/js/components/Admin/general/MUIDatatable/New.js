import React, { useEffect, useState, CSSProperties } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../../../../AxiosUser";
import Swal from "sweetalert2";
import $ from "jquery";

const New = (props) => {
    const [getRankParents, setRankParents] = useState([]);
    const [getRankTypes, setRankTypes] = useState([]);
    const [getRanks, setRanks] = useState([]);
    const [getGenders, setGenders] = useState([]);
    const [getComandlalID, setComandlalID] = useState([]);
    const [getUnitID, setUnitID] = useState([]);

    const [getComandlalIDFirst, setComandlalIDFirst] = useState("");
    const [getUnitIDFirst, setUnitIDFirst] = useState("");
    useEffect(() => {
        axios
            .post("/get/rankParent")
            .then((res) => {
                setRankParents(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post("/get/gender/admin")
            .then((res) => {
                setGenders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post("/get/ID/byComandlal")
            .then((res) => {
                if (userType === "comandlalAdmin" || userType === "unitAdmin") {
                    setComandlalIDFirst(res.data.firstComandlal);
                    setComandlalID(res.data.getComandlals);
                    fnSetComandlal(res.data.firstComandlal["id"]);
                }
                if (userType === "superAdmin") {
                    setComandlalID(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const formSchema = Yup.object().shape({
        rankParentID: Yup.number()
            // .required("Бүрэлдэхүүн сонгоно уу.")
            .notOneOf([0], "Бүрэлдэхүүн сонгоно уу."),
        rankTypeID: Yup.number().notOneOf([0], "Цолны төрөл сонгоно уу."),
        rankID: Yup.number().notOneOf([0], "Цол сонгоно уу."),
        gender: Yup.number().notOneOf([0], "Хүйс сонгоно уу."),
        firstName: Yup.string().required("Админий нэр оруулах шаардлагатай"),
        lastName: Yup.string().required("Админий Овог оруулах шаардлагатай"),
        rd: Yup.string().required("Регистрийн дугаар"),
        position: Yup.string().required("Албан тушаал оруулах шаардлагатай"),
        phone: Yup.string()
            .required("Утасны дугаар оруулана уу.")
            .matches(/^[0-9]+$/, "Зөвхөн цифр байх ёстой")
            .min(8, "8 оронтой байх ёстой!!!")
            .max(8, "8 оронтой байх ёстой!!!"),
        email: Yup.string()
            .email("Та заавал E-mail хаяг оруулан уу.")
            .required("Цахим хаяг оруулана уу."),
        userType: Yup.string().required("Админ төрөл сонгоно уу."),
        userComandlal: Yup.number().typeError("Командлал сонгоно уу."),
        userUnit: Yup.number().typeError("Анги сонгоно уу."),
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
            .post("/new/admin", {
                rankParentID: data.rankParentID,
                rankTypeID: data.rankTypeID,
                rankID: data.rankID,
                gender: data.gender,
                firstName: data.firstName,
                lastName: data.lastName,
                rd: data.rd,
                userType: data.userType,
                position: data.position,
                phone: data.phone,
                email: data.email,
                comandlal: data.userComandlal,
                unit: data.userUnit,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        rankParentID: "0",
                        rankTypeID: "0",
                        rankID: "0",
                        gender: "0",
                        firstName: "",
                        lastName: "",
                        rd: "",
                        userType: "",
                        position: "",
                        phone: "",
                        email: "",
                        userComandlal: "",
                        userUnit: 0,
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                props.refreshUsers();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeRankParent = (e) => {
        axios
            .post("/get/type/byParentID", {
                _rankParentID: e.target.value,
            })
            .then((res) => {
                setRankTypes(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const changeRankType = (e) => {
        axios
            .post("/get/rank/byTypeID", {
                _rankTypeID: e.target.value,
            })
            .then((res) => {
                setRanks(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fnSetComandlal = (inComandlal) => {
        axios
            .post("/get/ID/byUnit", {
                _comandlalID: inComandlal,
            })
            .then((res) => {
                if (userType === "unitAdmin") {
                    setUnitIDFirst(res.data.firstUnit);
                    setUnitID(res.data.getUnits);
                }
                if (
                    userType === "superAdmin" ||
                    userType === "comandlalAdmin"
                ) {
                    setUnitID(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="modal" id="adminNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">Нэмэх</h4>

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
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Бүрэлдэхүүн:
                                                </span>
                                            </div>
                                            <select
                                                className="form-control"
                                                {...register("rankParentID")}
                                                onChange={changeRankParent}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {getRankParents.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.rankParentName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.rankParentID?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Цолны төрөл:
                                                </span>
                                            </div>
                                            <select
                                                className="form-control"
                                                {...register("rankTypeID")}
                                                onChange={changeRankType}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {getRankTypes.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.rankTypeName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.rankTypeID?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Цол:
                                                </span>
                                            </div>
                                            <select
                                                className="form-control"
                                                {...register("rankID")}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {getRanks.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.rank}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.rankID?.message}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хүйс:
                                                </span>
                                            </div>
                                            <select
                                                className="form-control"
                                                {...register("gender")}
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {getGenders.map((el) => (
                                                    <option
                                                        key={el.id}
                                                        value={el.id}
                                                    >
                                                        {el.genderName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.gender?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Овог:
                                                </span>
                                            </div>
                                            <input
                                                {...register("lastName")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.lastName?.message}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Нэр:
                                                </span>
                                            </div>
                                            <input
                                                {...register("firstName")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.firstName?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Регистрийн дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("rd")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.rd?.message}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                {userType == "superAdmin" ||
                                                userType == "comandlalAdmin" ? (
                                                    <span className="input-group-text">
                                                        Админий эрх:
                                                    </span>
                                                ) : (
                                                    <span className="input-group-text">
                                                        Эрх:
                                                    </span>
                                                )}
                                            </div>

                                            {userType == "superAdmin" && (
                                                <select
                                                    className="form-control"
                                                    {...register("userType")}
                                                >
                                                    <option value="">
                                                        Сонгоно уу
                                                    </option>
                                                    <option value="superAdmin">
                                                        Энхийг дэмжих цэргийн
                                                        хамтын ажиллагааны
                                                        хэлтэс
                                                    </option>
                                                    <option value="comandlalAdmin">
                                                        Төрлийн цэрэг
                                                    </option>
                                                </select>
                                            )}
                                            {userType == "comandlalAdmin" && (
                                                <select
                                                    className="form-control"
                                                    {...register("userType")}
                                                >
                                                    <option value="unitAdmin">
                                                        ЗХ-ний анги байгууллага
                                                    </option>
                                                    <option value="unitUser">
                                                        Командлалын хэрэглэгч
                                                    </option>
                                                </select>
                                            )}
                                            {userType == "unitAdmin" && (
                                                <select
                                                    className="form-control"
                                                    {...register("userType")}
                                                >
                                                    <option value="unitUser">
                                                        Ангийн хэрэглэгч
                                                    </option>
                                                </select>
                                            )}
                                        </div>
                                        <p className="alerts">
                                            {errors.userType?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Албан тушаал:
                                                </span>
                                            </div>
                                            <textarea
                                                {...register("position")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.position?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Утасны дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("phone")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.phone?.message}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Цахим хаяг:
                                                </span>
                                            </div>
                                            <input
                                                {...register("email")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.email?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                {userType == "comandlalAdmin" ||
                                                userType == "unitAdmin" ? (
                                                    <span className="input-group-text">
                                                        Командлал:{" "}
                                                    </span>
                                                ) : (
                                                    <span className="input-group-text">
                                                        Командлал сонгох:
                                                    </span>
                                                )}
                                            </div>
                                            {userType == "superAdmin" ? (
                                                <select
                                                    className="form-control"
                                                    {...register(
                                                        "userComandlal",
                                                        {
                                                            onChange: (e) => {
                                                                fnSetComandlal(
                                                                    e.target
                                                                        .value
                                                                );
                                                            },
                                                        }
                                                    )}
                                                >
                                                    <option value="">
                                                        Сонгоно уу
                                                    </option>
                                                    {getComandlalID.map(
                                                        (el) => (
                                                            <option
                                                                key={el.id}
                                                                value={el.id}
                                                            >
                                                                {
                                                                    el.comandlalShortName
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            ) : (
                                                <select
                                                    className="form-control"
                                                    {...register(
                                                        "userComandlal",
                                                        setValue(
                                                            "userComandlal",
                                                            getComandlalIDFirst[
                                                                "id"
                                                            ]
                                                        )
                                                    )}
                                                    value={
                                                        getComandlalIDFirst[
                                                            "id"
                                                        ]
                                                    }
                                                    disabled={true}
                                                >
                                                    {getComandlalID.map(
                                                        (el) => (
                                                            <option
                                                                key={el.id}
                                                                value={el.id}
                                                            >
                                                                {
                                                                    el.comandlalShortName
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            )}
                                        </div>
                                        <p className="alerts">
                                            {errors.userComandlal?.message}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Анги сонгох:
                                                </span>
                                            </div>
                                            {userType === "superAdmin" ||
                                            userType === "comandlalAdmin" ? (
                                                <select
                                                    className="form-control"
                                                    {...register("userUnit")}
                                                >
                                                    <option value="0">
                                                        Сонгоно уу
                                                    </option>
                                                    {getUnitID.map((el) => (
                                                        <option
                                                            key={el.id}
                                                            value={el.id}
                                                        >
                                                            {el.unitShortName}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <select
                                                    className="form-control"
                                                    {...register(
                                                        "userUnit",
                                                        setValue(
                                                            "userUnit",
                                                            getUnitIDFirst["id"]
                                                        )
                                                    )}
                                                    value={getUnitIDFirst["id"]}
                                                    disabled={true}
                                                >
                                                    {getUnitID.map((el) => (
                                                        <option
                                                            key={el.id}
                                                            value={el.id}
                                                        >
                                                            {el.unitShortName}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                        <p className="alerts">
                                            {errors.userUnit?.message}
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

export default New;
