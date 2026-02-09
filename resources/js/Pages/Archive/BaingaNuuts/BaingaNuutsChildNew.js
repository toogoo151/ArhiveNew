import { yupResolver } from "@hookform/resolvers/yup";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const BaingaNuutsChildNew = ({ _parentID, refreshbaingaNuutsChild }) => {
    const formSchema = Yup.object().shape({
        barimt_ner: Yup.string().required("Баримт нэр оруулна уу"),
        barimt_ognoo: Yup.string().required("Баримт огноо оруулна уу"),
        barimt_dugaar: Yup.string().required("Баримт дугаар оруулна уу"),
        irsen_dugaar: Yup.string().required("Ирсэн дугаар оруулна уу"),
        yabsan_dugaar: Yup.string().required("Явсан дугаар оруулна уу"),
        uild_gazar: Yup.string().required("Үйлдсэн газар оруулна уу"),
        huudas_too: Yup.string().required("Хуудас тоо оруулна уу"),
        habsralt_too: Yup.string().required("Хавсралт тоо оруулна уу"),
        huudas_dugaar: Yup.string().required("Хуудас дугаар оруулна уу"),
        aguulga: Yup.string().required("Агуулга оруулна уу"),
        bichsen_ner: Yup.string().nullable(),
        bichsen_ognoo: Yup.string().nullable(),
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
    const fileInputRef = useRef(null);
    const [selectedfile, SetSelectedFile] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        refreshbaingaNuutsChild(_parentID);
    }, [_parentID]);

    const convertToBase64 = (e) => {
        let images = [];
        for (let i = 0; i < e.target.files.length; i++) {
            images.push(e.target.files[i]);
            let reader = new FileReader();
            let file = e.target.files[i];
            const fileNameExists = selectedfile.some(
                (existingFile) => existingFile.filename === file.name
            );

            if (fileNameExists) {
                alert(`File "${file.name}" аль хэдийн сонгосон байна.`);
                e.target.value = null; // 🔥 input цэвэрлэнэ
                return;
            }
            reader.onloadend = () => {
                SetSelectedFile((preValue) => {
                    return [
                        ...preValue,
                        {
                            id: nanoid(),
                            filename: e.target.files[i].name,
                            filetype: e.target.files[i].type,
                            fileimage: reader.result,
                            datetime:
                                e.target.files[
                                    i
                                ].lastModifiedDate.toLocaleString("en-IN"),
                            filesize: filesizes(e.target.files[i].size),
                        },
                    ];
                });
            };
            if (e.target.files[i]) {
                reader.readAsDataURL(file);
            }
        }
    };
    const DeleteSelectFile = (id) => {
        if (window.confirm("Энэ file-ийг хасах гэж байна!")) {
            const result = selectedfile.filter((data) => data.id !== id);
            SetSelectedFile(result);
        } else {
            // alert('No');
        }
    };
    const filesizes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    };

    const onSubmit = (data) => {
        axios
            .post("/new/baingaNuutsChild", {
                hnID: _parentID,
                barimt_ner: data.barimt_ner,
                barimt_ognoo: data.barimt_ognoo,
                barimt_dugaar: data.barimt_dugaar,
                irsen_dugaar: data.irsen_dugaar,
                yabsan_dugaar: data.yabsan_dugaar,
                uild_gazar: data.uild_gazar,
                huudas_too: data.huudas_too,
                habsralt_too: data.habsralt_too,
                huudas_dugaar: data.huudas_dugaar,
                aguulga: data.aguulga,
                bichsen_ner: data.bichsen_ner,
                bichsen_ognoo: data.bichsen_ognoo,
                data_url: selectedfile,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset(
                    {
                        barimt_ner: "",
                        barimt_ognoo: "",
                        barimt_dugaar: "",
                        irsen_dugaar: "",
                        yabsan_dugaar: "",
                        uild_gazar: "",
                        huudas_too: "",
                        habsralt_too: "",
                        huudas_dugaar: "",
                        aguulga: "",
                        bichsen_ner: "",
                        bichsen_ognoo: "",
                        file_ner: "",
                    },
                    {
                        keepIsSubmitted: false,
                        keepTouched: false,
                        keepIsValid: false,
                        keepSubmitCount: false,
                    }
                );
                SetSelectedFile([]); // 🔥 state цэвэрлэнэ
                if (fileInputRef.current) {
                    fileInputRef.current.value = null; // 🔥 input цэвэрлэнэ
                }
                refreshbaingaNuutsChild(_parentID);
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    return (
        <>
            <div className="modal" id="baingaNuutsChildNew">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                {" "}
                                БАРИМТ БИЧИГ НЭМЭХ{" "}
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
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Баримт бичгийн нэр:
                                                </span>
                                            </div>

                                            <input
                                                {...register("barimt_ner")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.barimt_ner?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Баримт бичгийн огноо:
                                                </span>
                                            </div>
                                            <input
                                                type="date"
                                                {...register("barimt_ognoo")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.barimt_ognoo?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Баримт бичгийн дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("barimt_dugaar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.barimt_dugaar?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Ирсэн бичгийн дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("irsen_dugaar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.irsen_dugaar?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row clearfix">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Явсан бичгийн дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("yabsan_dugaar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.yabsan_dugaar?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Үйлдсэн газар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("uild_gazar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.uild_gazar?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хуудас тоо:
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                {...register("huudas_too")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.huudas_too?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хавсралт тоо:
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                {...register("habsralt_too")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.habsralt_too?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row clearfix">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Хуудас дугаар:
                                                </span>
                                            </div>
                                            <input
                                                {...register("huudas_dugaar")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.huudas_dugaar?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Агуулга:
                                                </span>
                                            </div>
                                            <input
                                                {...register("aguulga")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.aguulga?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row clearfix">
                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Бичсэн ажилтан:
                                                </span>
                                            </div>
                                            <input
                                                {...register("bichsen_ner")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.bichsen_ner?.message}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    Бичсэн огноо:
                                                </span>
                                            </div>
                                            <input
                                                type="date"
                                                {...register("bichsen_ognoo")}
                                                className="form-control"
                                            />
                                        </div>
                                        <p className="alerts">
                                            {errors.bichsen_ognoo?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="btn btn-outline-primary w-100 mb-2">
                                            <i className="fas fa-upload mr-2"></i>{" "}
                                            Хавсралт файл сонгох
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                multiple
                                                hidden
                                                onChange={convertToBase64}
                                                ref={fileInputRef}
                                            />
                                        </label>

                                        {selectedfile.length === 0 && (
                                            <div className="text-muted text-center py-3 border rounded">
                                                Хавсралт файл сонгогдоогүй байна
                                            </div>
                                        )}

                                        {selectedfile.map((file) => (
                                            <div
                                                key={file.id}
                                                className="border rounded p-2 mb-2"
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <i
                                                            className={`far ${
                                                                file.filename.match(
                                                                    /\.pdf$/i
                                                                )
                                                                    ? "fa-file-pdf text-danger"
                                                                    : "fa-file-alt text-primary"
                                                            } fa-2x mr-3`}
                                                        ></i>

                                                        <div>
                                                            <div className="font-weight-bold">
                                                                {file.filename}
                                                            </div>
                                                            <small className="text-muted">
                                                                {file.filesize}{" "}
                                                                ·{" "}
                                                                {file.datetime}
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {file.filename.match(
                                                            /\.pdf$/i
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() =>
                                                                    setPreviewFile(
                                                                        file
                                                                    )
                                                                }
                                                            >
                                                                <i className="fas fa-eye"></i>{" "}
                                                                Урьдчилан харах
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                DeleteSelectFile(
                                                                    file.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {previewFile && (
                                <div
                                    className="modal fade show d-block"
                                    style={{ background: "rgba(0,0,0,0.5)" }}
                                >
                                    <div className="modal-dialog modal-xl">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">
                                                    {previewFile.filename}
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="close"
                                                    onClick={() =>
                                                        setPreviewFile(null)
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div className="modal-body p-0">
                                                <iframe
                                                    src={previewFile.fileimage}
                                                    title="PDF Preview"
                                                    width="100%"
                                                    height="600px"
                                                    style={{ border: "none" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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

export default BaingaNuutsChildNew;
