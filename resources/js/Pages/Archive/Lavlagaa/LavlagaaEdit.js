import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";
import { nanoid } from "nanoid";

const LavlagaaEdit = ({
    refreshLavlagaa,
    setRowsSelected,
    changeDataRow,
    isEditBtnClick,
    editRequestId,
}) => {
    const [humrugList, setHumrugList] = useState([]);
    const [dansList, setDansList] = useState([]);
    const [huseltList, setHuseltList] = useState([]);
    const [isDansInitialized, setIsDansInitialized] = useState(false);
    const openModalTimeoutRef = useRef(null);
    const lastHandledEditRequestIdRef = useRef(0);

    const fileInputRef = useRef(null);
    const [selectedfile, SetSelectedFile] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    // ================= FORM =================
    const schema = Yup.object().shape({
        lav_dugaar: Yup.string().required(
            "Хүсэлтийн бүртгэлийн дугаар сонгоно уу"
        ),
        lav_date: Yup.string().required(
            "Лавлагаа хүлээн авсан огноо оруулна уу"
        ),
        humrug_id: Yup.string().required("Хөмрөг сонгоно уу"),
        dans_id: Yup.string().required("Данс сонгоно уу"),
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
            lav_dugaar: "",
            lav_date: "",
            humrug_id: "",
            dans_id: "",
            hadgalamj_id: "",
            aguulga: "",
            too_hemjee: "",
            awsan_date: "",
            awsan_helber: "",
            customer_info: "",
        },
    });

    const selectedHumrugId = watch("humrug_id");
    const selectedLavDugaar = watch("lav_dugaar");

    const huseltOptions = useMemo(
        () =>
            huseltList.filter(
                (h) =>
                    h.burtgel_dugaar != null &&
                    String(h.burtgel_dugaar).trim() !== ""
            ),
        [huseltList]
    );

    const orphanLavDugaar = useMemo(() => {
        const v =
            selectedLavDugaar != null
                ? String(selectedLavDugaar).trim()
                : "";
        if (!v) return null;
        const inList = huseltOptions.some(
            (h) => String(h.burtgel_dugaar) === v
        );
        return inList ? null : v;
    }, [selectedLavDugaar, huseltOptions]);

    const filteredDans = dansList.filter(
        (d) => String(d.humrugID) == selectedHumrugId
    );

    // ================= FETCH DATA (same as lavlagaaNew) =================
    useEffect(() => {
        axios.get("/get/Humrug").then((res) => {
            setHumrugList(res.data);
        });
        axios.get("/get/Dans").then((res) => {
            setDansList(res.data);
        });
        axios
            .get("/get/huselt")
            .then((res) => {
                setHuseltList(
                    Array.isArray(res.data?.data) ? res.data.data : []
                );
            })
            .catch(() => setHuseltList([]));
    }, []);

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

            if (
                selectedfile.some((existing) => existing.filename === file.name)
            ) {
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

    // After хөмрөг/данс options load, sync данс (same idea as SedevEdit)
    useEffect(() => {
        if (
            !isDansInitialized &&
            changeDataRow &&
            selectedHumrugId &&
            filteredDans.length > 0
        ) {
            setValue(
                "dans_id",
                changeDataRow.dans_id != null
                    ? String(changeDataRow.dans_id)
                    : ""
            );
            setIsDansInitialized(true);
        }
    }, [
        selectedHumrugId,
        filteredDans,
        changeDataRow,
        isDansInitialized,
        setValue,
    ]);

    // ================= LOAD EDIT DATA =================
    useEffect(() => {
        if (!editRequestId) return;
        if (editRequestId === lastHandledEditRequestIdRef.current) return;
        lastHandledEditRequestIdRef.current = editRequestId;
        if (!changeDataRow?.id) return;

        setIsDansInitialized(false);

        reset({
            lav_dugaar: changeDataRow.lav_dugaar ?? "",
            lav_date: changeDataRow.lav_date ?? "",
            humrug_id:
                changeDataRow.humrug_id != null
                    ? String(changeDataRow.humrug_id)
                    : "",
            dans_id:
                changeDataRow.dans_id != null
                    ? String(changeDataRow.dans_id)
                    : "",
            hadgalamj_id: changeDataRow.hadgalamj_id ?? "",
            aguulga: changeDataRow.aguulga ?? "",
            too_hemjee: changeDataRow.too_hemjee ?? "",
            awsan_date: changeDataRow.awsan_date ?? "",
            awsan_helber: changeDataRow.awsan_helber ?? "",
            customer_info: changeDataRow.customer_info ?? "",
        });

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

        if (openModalTimeoutRef.current) {
            clearTimeout(openModalTimeoutRef.current);
        }
        openModalTimeoutRef.current = setTimeout(() => {
            if (window.$) {
                window.$("#LavlagaaEdit").modal("show");
            }
        }, 0);
    }, [editRequestId, changeDataRow, reset, setValue]);

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
        formData.append("lav_dugaar", data.lav_dugaar || "");
        formData.append("lav_date", data.lav_date || "");
        formData.append("humrug_id", data.humrug_id || "");
        formData.append("dans_id", data.dans_id || "");
        formData.append("hadgalamj_id", data.hadgalamj_id || "");
        formData.append("aguulga", data.aguulga || "");
        formData.append("too_hemjee", data.too_hemjee || "");
        formData.append("awsan_date", data.awsan_date || "");
        formData.append("awsan_helber", data.awsan_helber || "");
        formData.append("customer_info", data.customer_info || "");

        // Upload only if user selected a new file.
        const payloadFile =
            selectedfile.length > 0 && selectedfile[0].rawFile
                ? selectedfile[0].rawFile
                : null;
        if (payloadFile) {
            formData.append("file", payloadFile);
        }

        axios
            .post("/edit/lavlagaa", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset();
                SetSelectedFile([]);
                setPreviewFile(null);
                window.$("#LavlagaaEdit").modal("hide");
                setRowsSelected([]);
                refreshLavlagaa();
            })
            .catch((err) => {
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
            });
    };

    return (
        <div className="modal" id="LavlagaaEdit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Лавлагаа засах</h4>
                        <button className="close" data-dismiss="modal">
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Хүсэлтийн бүртгэлийн дугаар</label>
                                    <select
                                        className="form-control"
                                        {...register("lav_dugaar")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {orphanLavDugaar && (
                                            <option value={orphanLavDugaar}>
                                                {orphanLavDugaar}{" "}
                                                ( Хүсэлтийн жагсаалтад
                                                байхгүй)
                                            </option>
                                        )}
                                        {huseltOptions.map((h) => {
                                            const turul = h.huselt_turul;
                                            const turulLabel =
                                                turul?.name ??
                                                turul?.turul_name ??
                                                "";
                                            const labelSuffix = turulLabel
                                                ? ` — ${turulLabel}`
                                                : "";
                                            return (
                                                <option
                                                    key={h.id}
                                                    value={String(
                                                        h.burtgel_dugaar
                                                    )}
                                                >
                                                    {String(
                                                        h.burtgel_dugaar
                                                    ) + labelSuffix}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {errors.lav_dugaar && (
                                        <small className="text-danger d-block mt-1">
                                            {errors.lav_dugaar.message}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label>Лавлагааны огноо</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register("lav_date")}
                                    />
                                    {errors.lav_date && (
                                        <small className="text-danger">
                                            {errors.lav_date.message}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label>Хөмрөгийн дугаар</label>
                                    <select
                                        className="form-control"
                                        {...register("humrug_id")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {humrugList.map((h) => (
                                            <option key={h.id} value={h.id}>
                                                {h.humrug_dugaar}-{h.humrug_ner}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.humrug_id && (
                                        <small className="text-danger">
                                            {errors.humrug_id.message}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label>Данс</label>
                                    <select
                                        className="form-control"
                                        {...register("dans_id")}
                                        disabled={!selectedHumrugId}
                                    >
                                        <option value="">
                                            {selectedHumrugId
                                                ? "Сонгоно уу"
                                                : "Эхлээд хөмрөг сонгоно уу"}
                                        </option>
                                        {filteredDans.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.dans_dugaar}-{d.dans_ner}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.dans_id && (
                                        <small className="text-danger">
                                            {errors.dans_id.message}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>
                                        Хадгаламжийн нэгж, хуудасны дугаар
                                    </label>
                                    <input
                                        className="form-control"
                                        {...register("hadgalamj_id")}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Агуулга</label>
                                    <input
                                        className="form-control"
                                        {...register("aguulga")}
                                    />
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>Тоо хэмжээ</label>
                                    <input
                                        className="form-control"
                                        {...register("too_hemjee")}
                                    />
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-12">
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
                                                            {
                                                                currentFile.filename
                                                            }
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

                                    {selectedfile.length === 0 &&
                                        !currentFile && (
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

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label>Хүлээн авсан огноо</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register("awsan_date")}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Хүлээн авсан хэлбэр</label>
                                    <input
                                        className="form-control"
                                        {...register("awsan_helber")}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Үйлчлүүлэгчийн овог, нэр</label>
                                    <input
                                        className="form-control"
                                        {...register("customer_info")}
                                    />
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

export default LavlagaaEdit;
