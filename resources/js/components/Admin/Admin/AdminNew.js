import React, { useState, useEffect } from "react";
import ButtonShowModel from "../general/ButtonShowModel/ButtonShowModel";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./style.css";
import axios from "../../../AxiosUser";
import AlertSuccess from "../general/Alert/AlertSuccess";
import AlertError from "../general/Alert/AlertError";
import Swal from "sweetalert2";

const AdminNew = (props) => {
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const [sendMsg, setsendMsg] = useState(null);
    const [sendMsgErr, setsendMsgErr] = useState(null);
    const [userType, setuserType] = useState("");
    const [headerID, setheaderID] = useState(0);
    const [unitId, setUnitId] = useState(0);

    // let adminName, adminEmail, password;

    const formSchema = Yup.object().shape({
        adminType: Yup.string().required("Хэрэглэгчийн эрх сонгоно уу."),
        adminMenuPermission: Yup.string(),
        adminEmail: Yup.string()
            .email("Та заавал E-mail хаяг оруулан уу.")
            .required("Цахим хаяг шаардлагатай"),
        adminName: Yup.string().required("Админий нэр оруулах шаардлагатай"),
        password: Yup.string()
            .required("Нууц үг оруулах шаардлагатай")
            .min(8, "Нууц үг хамгын багадаа 8 тэмдэгт байх ёстой.")
            .max(64, "Нууц үг 64 тэмдэгтээс илүү байж болохгүй"),
        cpassword: Yup.string()
            .required("Нууц үгээ баталгаажуулах шаардлагатай.")
            .min(8, "Нууц үг хамгын багадаа 8 тэмдэгт байх ёстой.")
            .max(64, "Нууц үг 64 тэмдэгтээс илүү байж болохгүй")
            .oneOf([Yup.ref("password")], "Нууц үг таарахгүй байна."),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema),
    });
    // password = watch("password", "");
    // adminName = watch("adminName", "");
    // adminEmail = watch("adminEmail", "");

    const onSubmit = (data) => {
        axios
            .post("/new/amdin", {
                _token: document.querySelector('meta[name="csrf-token"]')
                    .content,
                name: data.adminName,
                email: data.adminEmail,
                password: data.password,
                user_type: data.adminType,
                permission: headerID,
                unitId: unitId,
            })
            .then((response) => {
                setsendMsg(response.data.msg);
                console.log(response.data);
                reset(
                    {
                        adminName: "",
                        adminEmail: "",
                        password: "",
                        cpassword: "",
                        adminType: "",
                        adminMenuPermission: "",
                    },
                    {
                        // keepErrors: true,
                        // keepDirty: true,
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                setheaderID(0);
                setUnitId(0);
                props.reloadDataTable();
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                setsendMsgErr(err.response.data.msg);
                // console.log(err.response.data.msg);
            });

        // reset();
    };

    const getChangeUserType = (e) => {
        if (e.target.value === "super" || e.target.value === "super2") {
            setheaderID(0);
            setUnitId(0);
        }
        setuserType(e.target.value);

    };

    const getHeaderId = (e) => {
        setUnitId(0);
        setheaderID(e.target.value);
    };

    const selectedUnit = (e) => {
        setheaderID(0);
        setUnitId(e.target.value);
    };

    return (
        <>
            <ButtonShowModel
                btnClassName={"btn btn-success"}
                modelType={"modal"}
                dataTargetID={"#adminNewModal"}
                spanIconClassName={"fas fa-solid fa-plus"}
                buttonName={"Нэмэх"}
            />
            <div className="modal" id="adminNewModal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">Хэрэглэгч нэмэх</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>
                        {/* Modal body */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Нэр:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    @
                                                </span>
                                            </div>
                                            <input
                                                {...register("adminName", {
                                                    required: true,
                                                    maxLength: 20,
                                                })}
                                                className="form-control"
                                                placeholder="Нэр..."
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.adminName?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Цахим хаяг:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            </div>
                                            <input
                                                {...register("adminEmail")}
                                                className="form-control"
                                                placeholder="Цахим хаяг..."
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.adminEmail?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Нууц үг:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i
                                                        id="showpass"
                                                        className="fa fa-eye icon"
                                                        onClick={() => {
                                                            setToggle1(
                                                                !toggle1
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>

                                            <input
                                                type={
                                                    toggle1
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control"
                                                placeholder="Нууц үг"
                                                {...register("password")}
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.password?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label className="float-righ">
                                            Нууц үг давтах:
                                        </label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i
                                                        id="showpass"
                                                        className="fa fa-eye icon"
                                                        onClick={() => {
                                                            setToggle2(
                                                                !toggle2
                                                            );
                                                        }}
                                                    ></i>
                                                </span>
                                            </div>

                                            <input
                                                type={
                                                    toggle2
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control"
                                                placeholder="Нууц үг давтах"
                                                {...register("cpassword")}
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.cpassword?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label>Хэрэглэгчийн эрх:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            </div>
                                            <select
                                                {...register("adminType")}
                                                className="form-control"
                                                onChange={getChangeUserType}
                                            >
                                                <option value="">
                                                    Сонгоно уу
                                                </option>
                                                <option value="super">
                                                    Super admin
                                                </option>
                                                <option value="super2">
                                                    Super admin 2
                                                </option>
                                                <option value="user">
                                                    admin
                                                </option>
                                                <option value="unit">
                                                    unit
                                                </option>
                                                <option value="userSolder">
                                                    user
                                                </option>
                                            </select>
                                        </div>
                                        <p className="alerts">
                                            {errors.adminType?.message}
                                        </p>
                                    </div>
                                </div>
                                {userType == "super" && ""}
                                {userType == "user" && (
                                    <div className="row">
                                        <div className="col-md-3 float-righ">
                                            <label>Цэс оруулах эрх:</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                </div>
                                                <select
                                                    onChange={getHeaderId}
                                                    className="form-control"
                                                    value={headerID}
                                                >
                                                    <option value="0">
                                                        Сонгоно уу
                                                    </option>
                                                    {props.getHeaderMenu.map(
                                                        (item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {
                                                                    item.header_menu_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {userType == "unit" && (
                                    <div className="row">
                                        <div className="col-md-3 float-righ">
                                            <label>Анги сонгох:</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                </div>
                                                <select
                                                    onChange={selectedUnit}
                                                    className="form-control"
                                                    value={unitId}
                                                >
                                                    <option value="0">
                                                        Сонгоно уу
                                                    </option>
                                                    {props.getUnits.map(
                                                        (item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.unit}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {userType == "userSolder" && (
                                    <div className="row">
                                        <div className="col-md-3 float-righ">
                                            <label>Анги сонгох:</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                </div>
                                                <select
                                                    onChange={selectedUnit}
                                                    className="form-control"
                                                    value={unitId}
                                                >
                                                    <option value="0">
                                                        Сонгоно уу
                                                    </option>
                                                    {props.getUnits.map(
                                                        (item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.unit}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {sendMsg && <AlertSuccess msg={sendMsg} />}
                                {sendMsgErr && <AlertError msg={sendMsgErr} />}
                            </div>

                            {/* Modal footer */}
                            <div className="modal-footer">
                                {userType == "super" &&
                                    headerID == 0 &&
                                    unitId == 0 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            data-dismiss=""
                                        >
                                            Нэмэх
                                        </button>
                                    )}
                                {userType == "super2" &&
                                    headerID == 0 &&
                                    unitId == 0 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            data-dismiss=""
                                        >
                                            Нэмэх
                                        </button>
                                    )}
                                {userType == "user" &&
                                    headerID != 0 &&
                                    unitId == 0 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            data-dismiss=""
                                        >
                                            Нэмэх
                                        </button>
                                    )}
                                {userType == "unit" &&
                                    headerID == 0 &&
                                    unitId != 0 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            data-dismiss=""
                                        >
                                            Нэмэх
                                        </button>
                                    )}
                                {userType == "userSolder" &&
                                    headerID == 0 &&
                                    unitId != 0 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            data-dismiss=""
                                        >
                                            Нэмэх
                                        </button>
                                    )}

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

export default AdminNew;
