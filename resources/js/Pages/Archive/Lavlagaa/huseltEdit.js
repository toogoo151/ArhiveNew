import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";


const HuseltEdit = ({
    refreshHuselt,
    setRowsSelected,
    changeDataRow,
    isEditBtnClick,
    editRequestId,
}) => {

    const openModalTimeoutRef = useRef(null);
    const lastHandledEditRequestIdRef = useRef(0);
    const fileInputRef = useRef(null);
    const [selectedfile, SetSelectedFile] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [huseltTurulList, setHuseltTurulList] = useState([]);

    useEffect(() => {
        axios
            .get("/get/huselt-turul")
            .then((res) => {
                setHuseltTurulList(res.data?.data ?? []);
            })
            .catch(() => setHuseltTurulList([]));
    }, []);

    // ================= FORM =================
    const schema = Yup.object().shape({
        burtgel_dugaar: Yup.string().required("Бүртгэлийн дугаар оруулна уу"),
        huselt_ognoo: Yup.string().required(
            "Хүсэлт гаргасан огноо оруулна уу"
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
        defaultValues: {
            burtgel_dugaar: "",
            huselt_ognoo: "",
            user_burt_dugaar: "",
            user_register: "",
            user_name: "",
            user_location: "",
            user_phonenumber: "",
            huselt_turul_id: "",
            huselt_aguulga: "",
            ajiltan_info: "",
        },
    });

    // ================= LOAD EDIT DATA =================
    useEffect(() => {
        if (!editRequestId) return;
        if (editRequestId === lastHandledEditRequestIdRef.current) return;
        lastHandledEditRequestIdRef.current = editRequestId;
        if (!changeDataRow?.id) return;


        reset({
            burtgel_dugaar: changeDataRow.burtgel_dugaar ?? "",
            huselt_ognoo: changeDataRow.huselt_ognoo ?? "",
            user_burt_dugaar: changeDataRow.user_burt_dugaar ?? "",
            user_register: changeDataRow.user_register ?? "",
            user_name: changeDataRow.user_name ?? "",
            user_location: changeDataRow.user_location ?? "",
            user_phonenumber: changeDataRow.user_phonenumber ?? "",
            huselt_turul_id:
                changeDataRow.huselt_turul_id != null
                    ? String(changeDataRow.huselt_turul_id)
                    : "",
            huselt_aguulga: changeDataRow.huselt_aguulga ?? "",
            ajiltan_info: changeDataRow.ajiltan_info ?? "",
        });



        if (openModalTimeoutRef.current) {
            clearTimeout(openModalTimeoutRef.current);
        }
        openModalTimeoutRef.current = setTimeout(() => {
            if (window.$) {
                window.$("#HuseltEdit").modal("show");
            }
        }, 0);
    }, [editRequestId, changeDataRow, reset]);

    useEffect(() => {
        return () => {
            if (openModalTimeoutRef.current) {
                clearTimeout(openModalTimeoutRef.current);
            }
        };
    }, []);

    // ================= SUBMIT =================
    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append("id", changeDataRow.id);
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
            .post("/edit/huselt", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset();
                SetSelectedFile([]);
                setPreviewFile(null);
                window.$("#HuseltEdit").modal("hide");
                setRowsSelected([]);
                refreshHuselt();
            })
            .catch((err) => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    return (
        <div className="modal" id="HuseltEdit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Хүсэлт засах</h4>
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
                                    {errors.burtgel_dugaar && (
                                        <small className="text-danger">
                                            {errors.burtgel_dugaar.message}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label>Хүсэлт гаргасан огноо</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register("huselt_ognoo")}
                                    />
                                    {errors.huselt_ognoo && (
                                        <small className="text-danger">
                                            {errors.huselt_ognoo.message}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                        <label>Хүсэлт захиалагчийн бүртгэлийн дугаар</label>
                                    <input
                                        className="form-control"
                                        {...register("user_burt_dugaar")}
                                        />
                                    {errors.user_burt_dugaar && (
                                        <small className="text-danger">
                                            {errors.user_burt_dugaar.message}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                        <label>Захиалагчийн регистер</label>
                                    <input
                                        className="form-control"
                                        {...register("user_register")}
                                    />
                                    {errors.user_register && (
                                        <small className="text-danger">
                                            {errors.user_register.message}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>
                                        Захиалагчийн нэр
                                    </label>
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
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>Захиалагчийн утас</label>
                                    <input
                                        className="form-control"
                                        {...register("user_phonenumber")}
                                    />
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-12">
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
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>Хүсэлтийн агуулга</label>
                                    <input
                                        type="date"
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
                                Засах
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
    );
};

export default HuseltEdit;
