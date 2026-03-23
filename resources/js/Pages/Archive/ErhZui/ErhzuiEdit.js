import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";
import { nanoid } from "nanoid";

const ErhzuiEdit = ({
    refreshErhzui,
    setRowsSelected,
    changeDataRow,
    isEditBtnClick,
    editRequestId
}) => {


    const openModalTimeoutRef = useRef(null);
    const lastHandledEditRequestIdRef = useRef(0);

    const fileInputRef = useRef(null);
    const [selectedfile, SetSelectedFile] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);


    // ================= FORM =================
    const schema = Yup.object().shape({
        erhzui_turul: Yup.string().required("Эрх зүйн төрөл оруулна уу"),
        erhzui_akt_ner: Yup.string().required("Эрх зүйн акт оруулна уу"),
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
           erhzui_turul: "",
           erhzui_akt_ner: "",
            tailbar: "",
            file: null,
        },
    });

    const filesizes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const convertToBase64 = (e) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }

        // Store in RHF as well, in case you want validation/submit hooks later.
        setValue("file", files, { shouldValidate: true });

        const newItems = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (selectedfile.some((existing) => existing.filename === file.name)) {
                alert(`File "${file.name}" аль хэдийн сонгосон байна.`);
                continue;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                SetSelectedFile((prev) => [
                    ...prev,
                    {
                        id: nanoid(),
                        filename: file.name,
                        filetype: file.type,
                        fileimage: reader.result,
                        datetime: file.lastModifiedDate
                            ? file.lastModifiedDate.toLocaleString("en-IN")
                            : new Date().toLocaleString("en-IN"),
                        filesize: filesizes(file.size),
                        rawFile: file,
                    },
                ]);
            };

            reader.readAsDataURL(file);
            newItems.push(file);
        }

        if (newItems.length > 0 && selectedfile.length === 0) {
            fileInputRef.current.value = "";
        }
    };

    const DeleteSelectFile = (id) => {
        if (window.confirm("Энэ file-ийг хасах гэж байна!")) {
            const result = selectedfile.filter((data) => data.id !== id);
            SetSelectedFile(result);
            if (result.length === 0) {
                setValue("file", null);
            }
        }
    };




    // ================= LOAD EDIT DATA =================
    useEffect(() => {
        if (!editRequestId) return;
        if (editRequestId === lastHandledEditRequestIdRef.current) return;
        lastHandledEditRequestIdRef.current = editRequestId;
        if (!changeDataRow?.id) return;

        // Set values first...
        reset({
            erhzui_turul: changeDataRow.erhzui_turul ?? "",
            erhzui_akt_ner: changeDataRow.erhzui_akt_ner ?? "",
            tailbar: changeDataRow.tailbar ?? "",
            // Do not set `file` here: browsers do not allow programmatic setting
            // of `<input type="file" />` values. We'll upload only if user selects one.
        });

        // Show the currently saved attachment name (browser can't prefill <input type="file">).
        SetSelectedFile([]);
        setPreviewFile(null);
        setCurrentFile(null);
        setValue("file", null);

        if (changeDataRow.file) {
            try {
                const parsed = JSON.parse(changeDataRow.file);
                if (parsed?.path) {
                    setCurrentFile({
                        id: "current",
                        filename: parsed.name || parsed.path.split("/").pop(),
                        fileimage: `${window.location.origin}/storage/${parsed.path}`,
                    });
                }
            } catch (err) {
                // If DB stores just a path string instead of JSON.
                if (typeof changeDataRow.file === "string") {
                    const pathStr = changeDataRow.file;
                    setCurrentFile({
                        id: "current",
                        filename: pathStr.split("/").pop(),
                        fileimage: `${window.location.origin}/storage/${pathStr}`,
                    });
                }
            }
        }

        // ...then open modal on next tick to avoid "double click" / empty first paint.
        if (openModalTimeoutRef.current) {
            clearTimeout(openModalTimeoutRef.current);
        }
        openModalTimeoutRef.current = setTimeout(() => {
            if (window.$) {
                window.$("#ErhzuiEdit").modal("show");
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
        formData.append("erhzui_turul", data.erhzui_turul);
        formData.append("erhzui_akt_ner", data.erhzui_akt_ner || "");
        formData.append("tailbar", data.tailbar || "");

        // Upload only if user selected a new file.
        const payloadFile =
            selectedfile.length > 0 && selectedfile[0].rawFile
                ? selectedfile[0].rawFile
                : null;
        if (payloadFile) {
            formData.append("file", payloadFile);
        }

        axios
            .post("/edit/erhzui", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset();
                SetSelectedFile([]);
                setPreviewFile(null);
                window.$("#ErhzuiEdit").modal("hide");
                setRowsSelected([]);
                refreshErhzui();
            })
            .catch((err) => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    return (
        <div className="modal" id="ErhzuiEdit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Эрх зүй засах</h4>
                        <button className="close" data-dismiss="modal">×</button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {/* ================= HUMRUG ================= */}
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Эрх зүйн төрөл</label>
                                     <input
                                        className="form-control"
                                        {...register("erhzui_turul")}
                                    />

                                </div>
                                <div className="col-md-6">
                                    <label>Эрх зүйн акт</label>
                                     <input
                                        className="form-control"
                                        {...register("erhzui_akt_ner")}
                                    />
                                </div>
                            </div>

                            {/* ================= DANS ================= */}
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>Тайлбар</label>
                                     <input
                                        className="form-control"
                                        {...register("tailbar")}
                                    />

                                </div>

                                <div className="col-md-6">
                                    <label>Хавсралт файл</label>
                                    {selectedfile.length === 0 && currentFile && (
                                        <div className="border rounded p-2 mb-2">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <i
                                                        className={`far ${
                                                            currentFile.filename.match(
                                                                /\.pdf$/i
                                                            )
                                                                ? "fa-file-pdf text-danger"
                                                                : "fa-file-alt text-primary"
                                                        } fa-2x mr-3`}
                                                    ></i>

                                                    <div>
                                                        <div className="font-weight-bold">
                                                            {currentFile.filename}
                                                        </div>
                                                        <small className="text-muted">
                                                            Одоогийн хавсралт
                                                        </small>
                                                    </div>
                                                </div>

                                                <div>
                                                    {currentFile.filename.match(
                                                        /\.pdf$/i
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-info mr-2"
                                                            onClick={() =>
                                                                setPreviewFile(
                                                                    currentFile
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-eye"></i>{" "}
                                                            Урьдчилан харах
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedfile.length === 0 && !currentFile && (
                                        <div className="text-muted text-center py-3 border rounded mb-2">
                                            Хавсралт файл сонгогдоогүй байна
                                        </div>
                                    )}

                                    <label className="btn btn-outline-primary w-100 mb-2">
                                        <i className="fas fa-upload mr-2"></i>{" "}
                                        Хавсралт файл солих
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            multiple
                                            hidden
                                            onChange={convertToBase64}
                                            ref={fileInputRef}
                                        />
                                    </label>

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
                                                            {file.filesize} ·{" "}
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

export default ErhzuiEdit;
