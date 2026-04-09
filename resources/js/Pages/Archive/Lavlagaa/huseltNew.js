import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";
const HuseltNew = ({ refreshHuselt }) => {
    const schema = Yup.object().shape({
        burtgel_dugaar: Yup.string().required("Лавлагааны дугаар оруулна уу"),
        huselt_ognoo: Yup.string().required(
            "Лавлагаа хүлээн авсан огноо оруулна уу"
        ),
        huselt_turul_id: Yup.string().required("Хүсэлтийн төрөл сонгоно уу"),
    });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [huseltTurulList, setHuseltTurulList] = useState([]);

    useEffect(() => {
        axios
            .get("/get/huselt-turul")
            .then((res) => {
                setHuseltTurulList(res.data?.data ?? []);
            })
            .catch(() => setHuseltTurulList([]));
    }, []);

    // ================= SUBMIT =================
    const onSubmit = (data) => {
        const formData = new FormData();

        // append all form fields
        formData.append("burtgel_dugaar", data.burtgel_dugaar || "");
        formData.append("huselt_ognoo", data.huselt_ognoo || "");
        formData.append("user_burt_dugaar", data.user_burt_dugaar || "");
        formData.append("user_register", data.user_register || "");
        formData.append("user_name", data.user_name || "");
        formData.append("user_location", data.user_location || "");
        formData.append("user_phonenumber", data.user_phonenumber || "");
        formData.append("huselt_turul_id", data.huselt_turul_id || "");
        formData.append("huselt_aguulga", data.huselt_aguulga || "");
        formData.append("ajiltan_info", data.ajiltan_info || "");



        axios
            .post("/new/huselt", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset();
                refreshHuselt();
                window.$("#HuseltNew").modal("hide");
            })
            .catch((err) => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    return (
        <div className="modal" id="HuseltNew">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Хүсэлт нэмэх</h4>
                        <button className="close" data-dismiss="modal">
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Бүртгэлийн дугаар</label>
                                    <input
                                        className="form-control"
                                        {...register("burtgel_dugaar")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Хүсэлт гаргасан огноо</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register("huselt_ognoo")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Хүсэлт захиалагчийн бүртгэлийн дугаар</label>
                                    <input
                                        className="form-control"
                                        {...register("user_burt_dugaar")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Захиалагчийн регистер</label>
                                    <input
                                        className="form-control"
                                        {...register("user_register")}
                                        maxLength={10}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Захиалагчийн нэр</label>
                                    <input
                                        className="form-control"
                                        {...register("user_name")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Захиалагчийн хаяг</label>
                                    <input
                                        className="form-control"
                                        {...register("user_location")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Захиалагчийн утас</label>
                                    <input
                                        className="form-control"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        {...register("user_phonenumber")}
                                        maxLength={8}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Хүсэлтийн төрөл</label>
                                    <select
                                        className="form-control"
                                        {...register("huselt_turul_id")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {huseltTurulList.map((el) => (
                                            <option key={el.id} value={el.id}>
                                                {el.name ??
                                                    el.turul_name ??
                                                    `#${el.id}`}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.huselt_turul_id && (
                                        <small className="text-danger">
                                            {errors.huselt_turul_id.message}
                                        </small>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label>Хүсэлтийн агуулга</label>
                                    <input
                                        className="form-control"
                                        {...register("huselt_aguulga")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Ажилтны мэдээлэл</label>
                                    <input
                                        className="form-control"
                                        {...register("ajiltan_info")}
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="modal-footer">
                            <button className="btn btn-success" type="submit">
                                Нэмэх
                            </button>
                            <button
                                className="btn btn-danger"
                                data-dismiss="modal"
                                type="button"
                            >
                                Хаах
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HuseltNew;
