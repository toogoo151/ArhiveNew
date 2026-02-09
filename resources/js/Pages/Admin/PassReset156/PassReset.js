import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../../../AxiosUser";
import AlertSuccess from "../../../components/Admin/general/Alert/AlertSuccess";
import AlertError from "../../../components/Admin/general/Alert/AlertError";

const PassReset = () => {
    const [oldPassword, setoldPassword] = useState(false);
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);

    const [sendMsg, setsendMsg] = useState(null);
    const [sendMsgErr, setsendMsgErr] = useState(null);

    const formSchema = Yup.object().shape({
        oldPassword: Yup.string().required("Нууц үг оруулах шаардлагатай"),
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

    const onSubmit = (data) => {
        axios
            .post("/change/password", {
                _token: document.querySelector('meta[name="csrf-token"]')
                    .content,
                oldPassword: data.oldPassword,
                newPassword: data.cpassword,
            })
            .then((response) => {
                setsendMsg(response.data.msg);
                reset(
                    {
                        oldPassword: "",
                        password: "",
                        cpassword: "",
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
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                setsendMsgErr(err.response.data.msg);
                // console.log(err.response.data.msg);
            });
    };
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-3 float-righ">
                        <label className="float-righ">Хуучин нууц үг:</label>
                    </div>
                    <div className="col-md-9">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i
                                        id="showpass"
                                        className="fa fa-eye icon"
                                        onClick={() => {
                                            setoldPassword(!oldPassword);
                                        }}
                                    />
                                </span>
                            </div>

                            <input
                                type={oldPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Нууц үг"
                                {...register("oldPassword")}
                            />
                        </div>
                        <p className="alerts">{errors.oldPassword?.message}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 float-righ">
                        <label className="float-righ">Шинэ нууц үг:</label>
                    </div>
                    <div className="col-md-9">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i
                                        id="showpass"
                                        className="fa fa-eye icon"
                                        onClick={() => {
                                            setToggle1(!toggle1);
                                        }}
                                    />
                                </span>
                            </div>

                            <input
                                type={toggle1 ? "text" : "password"}
                                className="form-control"
                                placeholder="Нууц үг"
                                {...register("password")}
                            />
                        </div>
                        <p className="alerts">{errors.password?.message}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 float-righ">
                        <label className="float-righ">
                            Шинэ нууц үг давтах:
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
                                            setToggle2(!toggle2);
                                        }}
                                    ></i>
                                </span>
                            </div>

                            <input
                                type={toggle2 ? "text" : "password"}
                                className="form-control"
                                placeholder="Нууц үг давтах"
                                {...register("cpassword")}
                            />
                        </div>
                        <p className="alerts">{errors.cpassword?.message}</p>
                    </div>
                </div>

                {sendMsg && <AlertSuccess msg={sendMsg} />}
                {sendMsgErr && <AlertError msg={sendMsgErr} />}
                <button
                    type="submit"
                    className="btn btn-success"
                    // onClick={handleSubmit}
                >
                    Солих
                </button>
            </form>
        </>
    );
};

export default PassReset;
