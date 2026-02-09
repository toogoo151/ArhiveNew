import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const BaingaNuutsChildEdit = (props) => {
    const [showModal, setShowModal] = useState("");
    const [barimt_ner, setBarimt_ner] = useState("");
    const [barimt_ognoo, setBarimt_ognoo] = useState("");
    const [barimt_dugaar, setBarimt_dugaar] = useState("");
    const [irsen_dugaar, setIrsen_dugaar] = useState("");
    const [yabsan_dugaar, setYabsan_dugaar] = useState("");
    const [uild_gazar, setUild_gazar] = useState("");
    const [huudas_too, setHuudas_too] = useState("");
    const [habsralt_too, setHabsralt_too] = useState("");
    const [huudas_dugaar, setHuudas_dugaar] = useState("");
    const [aguulga, setAguulga] = useState("");
    const [bichsen_ner, setBichsen_ner] = useState("");
    const [bichsen_ognoo, setBichsen_ognoo] = useState("");
    const [data_url, setData_url] = useState("");

    const [getDataRow, setDataRow] = useState([]);

    useEffect(() => {
        setDataRow(props.changeDataRow);
    }, [props.changeDataRow]);

    useEffect(() => {
        if (
            props.changeDataRow &&
            Object.keys(props.changeDataRow).length > 0
        ) {
            setBarimt_ner(props.changeDataRow.barimt_ner || "");
            setBarimt_ognoo(
                props.changeDataRow.barimt_ognoo
                    ? props.changeDataRow.barimt_ognoo.split(" ")[0]
                    : ""
            );
            setBarimt_dugaar(props.changeDataRow.barimt_dugaar || "");
            setIrsen_dugaar(props.changeDataRow.irsen_dugaar || "");
            setYabsan_dugaar(props.changeDataRow.yabsan_dugaar || "");
            setUild_gazar(props.changeDataRow.uild_gazar || "");
            setHuudas_too(props.changeDataRow.huudas_too || "");
            setHabsralt_too(props.changeDataRow.habsralt_too || "");
            setHuudas_dugaar(props.changeDataRow.huudas_dugaar || "");
            setAguulga(props.changeDataRow.aguulga || "");
            setBichsen_ner(props.changeDataRow.bichsen_ner || "");
            setBichsen_ognoo(
                props.changeDataRow.bichsen_ognoo
                    ? props.changeDataRow.bichsen_ognoo.split(" ")[0]
                    : ""
            );
            setData_url(props.changeDataRow.data_url || "");

            if (props.changeDataRow.file_ner) {
                const files = props.changeDataRow.file_ner
                    .split(";")
                    .filter((f) => f !== "")
                    .map((url, index) => ({
                        id: "old_" + index,
                        filename: url.split("/").pop(),
                        url: url,
                    }));

                setOldFiles(files);
            } else {
                setOldFiles([]);
            }

            SetSelectedFile([]);
        }
    }, [props.changeDataRow]);

    const fileInputRef = useRef(null);
    const [selectedfile, SetSelectedFile] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [oldFiles, setOldFiles] = useState([]);

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

    const saveComand = () => {
        props.setRowsSelected([]);
        axios
            .post("/edit/baingaNuutsChild", {
                id: props.changeDataRow.id,
                barimt_ner: barimt_ner,
                barimt_ognoo: barimt_ognoo,
                barimt_dugaar: barimt_dugaar,
                irsen_dugaar: irsen_dugaar,
                yabsan_dugaar: yabsan_dugaar,
                uild_gazar: uild_gazar,
                huudas_too: huudas_too,
                habsralt_too: habsralt_too,
                huudas_dugaar: huudas_dugaar,
                aguulga: aguulga,
                bichsen_ner: bichsen_ner,
                bichsen_ognoo: bichsen_ognoo,
                data_url: selectedfile,
                old_files: oldFiles,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                setBarimt_ner("");
                setBarimt_ognoo("");
                setBarimt_dugaar("");
                setIrsen_dugaar("");
                setYabsan_dugaar("");
                setUild_gazar("");
                setHuudas_too("");
                setHabsralt_too("");
                setHuudas_dugaar("");
                setAguulga("");
                setBichsen_ner("");
                setBichsen_ognoo("");
                SetSelectedFile([]); // 🔥 state цэвэрлэнэ
                if (fileInputRef.current) {
                    fileInputRef.current.value = null; // 🔥 input цэвэрлэнэ
                }
                if (window.$) {
                    window.$("#baingaNuutsChildEdit").modal("hide");
                }

                props.refreshbaingaNuutsChild(props.parentID);
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg);
            });
    };

    const changeBarimtNer = (e) => {
        setBarimt_ner(e.target.value);
    };
    const changeBarimtOgnoo = (e) => {
        setBarimt_ognoo(e.target.value);
    };
    const changeBarimtdugaar = (e) => {
        setBarimt_dugaar(e.target.value);
    };

    const changeIrsendugaar = (e) => {
        setIrsen_dugaar(e.target.value);
    };
    const changeYabsandugaar = (e) => {
        setYabsan_dugaar(e.target.value);
    };
    const changeUildgazar = (e) => {
        setUild_gazar(e.target.value);
    };
    const changeHuudasToo = (e) => {
        setHuudas_too(e.target.value);
    };

    const changeHabsralttoo = (e) => {
        setHabsralt_too(e.target.value);
    };

    const changeHuudasdugaar = (e) => {
        setHuudas_dugaar(e.target.value);
    };
    const changeAguulga = (e) => {
        setAguulga(e.target.value);
    };
    const changeBichsenner = (e) => {
        setBichsen_ner(e.target.value);
    };
    const changeBichsenognoo = (e) => {
        setBichsen_ognoo(e.target.value);
    };

    // const deleteOldFile = (file) => {
    //     Swal.fire({
    //         title: "Устгах уу?",
    //         text: `"${file.filename}" файлыг устгах гэж байна`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Тийм, устга",
    //         cancelButtonText: "Болих",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             axios
    //                 .post("/delete/baingaNuutsChildFile", {
    //                     id: props.changeDataRow.id,
    //                     file_url: file.url,
    //                 })
    //                 .then((res) => {
    //                     Swal.fire(res.data.msg);

    //                     // 🔥 UI дээрээс устгасан файлыг хасна
    //                     const filtered = oldFiles.filter(
    //                         (f) => f.url !== file.url
    //                     );
    //                     setOldFiles(filtered);
    //                     props.refreshbaingaNuutsChild(props.parentID);
    //                 })
    //                 .catch((err) => {
    //                     Swal.fire(
    //                         err.response?.data?.msg || "Устгах үед алдаа гарлаа"
    //                     );
    //                 });
    //         }
    //     });
    // };

    const deleteOldFile = (file) => {
        Swal.fire({
            title: "Устгах уу?",
            text: `"${file.filename}" файлыг устгах гэж байна`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Тийм, устга",
            cancelButtonText: "Болих",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post("/delete/baingaNuutsChildFile", {
                        id: props.changeDataRow.id,
                        file_url: file.url,
                    })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title: "Амжилттай",
                            text: res.data.msg,
                            timer: 1500,
                            showConfirmButton: false,
                        });

                        //  UI дээрээс устгасан файлыг хасна
                        setOldFiles((prev) =>
                            prev.filter((f) => f.url !== file.url)
                        );

                        // parent list дахин ачаална
                        props.refreshbaingaNuutsChild(props.parentID);
                    })
                    .catch((err) => {
                        Swal.fire({
                            icon: "error",
                            title: "Алдаа",
                            text:
                                err.response?.data?.msg ||
                                "Устгах үед алдаа гарлаа",
                        });
                    });
            }
        });
    };

    const changeDataurl = (e) => {
        setData_url(e.target.value);
    };

    return (
        <>
            <div className="modal" id="baingaNuutsChildEdit">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">БИЧИГ БАРИМТ ЗАСАХ</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>

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
                                            className="form-control"
                                            onChange={changeBarimtNer}
                                            value={barimt_ner}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeBarimtOgnoo}
                                            value={barimt_ognoo}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeBarimtdugaar}
                                            value={barimt_dugaar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Ирсэн бичгийн дугаар:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeIrsendugaar}
                                            value={irsen_dugaar}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeYabsandugaar}
                                            value={yabsan_dugaar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Үйлдсэн газар:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeUildgazar}
                                            value={uild_gazar}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeHuudasToo}
                                            value={huudas_too}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeHabsralttoo}
                                            value={habsralt_too}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeHuudasdugaar}
                                            value={huudas_dugaar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Агуулга:
                                            </span>
                                        </div>
                                        <input
                                            className="form-control"
                                            onChange={changeAguulga}
                                            value={aguulga}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeBichsenner}
                                            value={bichsen_ner}
                                        />
                                    </div>
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
                                            className="form-control"
                                            onChange={changeBichsenognoo}
                                            value={bichsen_ognoo}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    {oldFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="border rounded p-2 mb-2 bg-light"
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
                                                    </div>
                                                </div>

                                                <div>
                                                    {/* Нээх */}
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-sm btn-outline-info mr-2"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </a>

                                                    {/* 🔥 УСТГАХ */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            deleteOldFile(file)
                                                        }
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-success"
                                data-dismiss=""
                                onClick={saveComand}
                            >
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default BaingaNuutsChildEdit;
