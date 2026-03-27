import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
// import BaingaHadgalahHugatsaa from "../BaingaIlts/BaingaHadgalahHugatsaa";
import "./Index.css";
import TurNuutsChild from "./TurNuutsChild";
import TurNuutsEdit from "./TurNuutsEdit";
import TurNuutsNew from "./TurNuutsNew";
import TurNuutsShiljuuleh from "./TurNuutsShiljuuleh";

import useAuthPermission from "../../../useAuthPermission";
import Spinner from "../../../Spinner";

const Index = () => {
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    // const [isFilterActive, setIsFilterActive] = useState(false);

    const [getTurNuuts, setTurNuuts] = useState([]);
    const [getHumrug, setHumrug] = useState([]);
    const [getDans, setDans] = useState([]);

    //select
    const [allDans, setAllDans] = useState([]); // анхны бүх дата
    const [selectedHumrug, setSelectedHumrug] = useState(0);
    const [selectedDans, setselectedDans] = useState(0);
    //select

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null); // анх null
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const isDisabled = selectedHumrug === 0 || selectedDans === 0;

    const [activeTab, setActiveTab] = useState("ilt");

    const [showShiljuulehModal, setShowShiljuulehModal] = useState(false);

    const [showModal] = useState("modal");
    const { tubshin, loading, error } = useAuthPermission();

    useEffect(() => {
        refreshTurNuuts();
    }, [selectedHumrug, selectedDans]);

    useEffect(() => {
        setSelectedFile(null);
        const input = document.getElementById("TurNuuts");
        if (input) input.value = null;
    }, [selectedHumrug, selectedDans]);

    const selectedHumrugName = getHumrug.find(
        (h) => h.id === selectedHumrug
    )?.humrug_ner;

    const selectedDansName = getDans.find(
        (d) => d.id === selectedDans
    )?.dans_ner;
    const handlePreview = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1, // array хэлбэрээр авна
            });

            setPreviewData(jsonData);
            setShowPreviewModal(true);
        };

        reader.readAsArrayBuffer(file);
    };

    const importExcel = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("humrug_id", selectedHumrug);
        formData.append("dans_id", selectedDans);

        axios
            .post("/import/TurNuuts", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshTurNuuts(); // <-- Table refresh хийж өгөгдөл шинэчлэгдэх
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };

    const refreshTurNuuts = () => {
        axios.get("/get/TurNuuts").then((res) => {
            const reversed = [...res.data].reverse();
            setAllDans(res.data);
            if (selectedHumrug !== 0 && selectedDans !== 0) {
                // 🔹 1. Фильтер хийх
                let filteredData = res.data.filter(
                    (item) =>
                        Number(item.humrug_id) === Number(selectedHumrug) &&
                        Number(item.dans_id) === Number(selectedDans)
                );

                // 🔹 2. Хугацаа хэтэрсэн мөрүүдийг дээд талд гаргах
                filteredData.sort((a, b) => {
                    const aExpired = isExpiredRow(a) ? 1 : 0;
                    const bExpired = isExpiredRow(b) ? 1 : 0;

                    // Хугацаа хэтэрсэн = 1 → дээд
                    return bExpired - aExpired;
                });

                setTurNuuts(filteredData);
            } else {
                setTurNuuts([]);
            }
        });
    };

    useEffect(() => {
        if (getTurNuuts.length) {
            console.log("ROW SAMPLE:", getTurNuuts[0]);
            console.log("EXPIRED:", isExpiredRow(getTurNuuts[0]));
        }
    }, [getTurNuuts]);

    const isExpiredRow = (row) => {
        if (!row?.on_suul || !row?.hugatsaa) return false;

        // "1", "1 жил", "70 жил" → 1 / 70
        const years = parseInt(row.hugatsaa, 10);

        if (isNaN(years)) return false;

        // 70 жил = байнгын хадгалалт
        if (years >= 70) return false;

        const start = new Date(row.on_suul);
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + years);

        return end < new Date();
    };
    const expiredCount = getTurNuuts.filter(isExpiredRow).length;
    useEffect(() => {
        axios
            .get("/get/Humrugs")
            .then((res) => {
                setHumrug(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setselectedDans(0);
    }, [selectedHumrug]);

    useEffect(() => {
        if (selectedHumrug === 0) {
            setDans([]);
            return;
        }

        axios
            .get(`/get/DansburtgelTurNuuts/${selectedHumrug}`)
            .then((res) => {
                setDans(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [selectedHumrug]);

    useEffect(() => {
        setRowsSelected([]);
        setclickedRowData(null);
    }, [selectedHumrug, selectedDans]);

    // Row сонголтын watcher
    useEffect(() => {
        const rowIndex = getRowsSelected[0];

        if (rowIndex !== undefined && getTurNuuts[rowIndex] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getTurNuuts[rowIndex]);
        } else {
            setclickedRowData(null);
        }
    }, [getRowsSelected, getTurNuuts]);

    // Get current authenticated user's tubshin on mount
    if (loading)
        return (
            <div>
                <Spinner />
            </div>
        );
    if (error) return <p>Алдаа гарлаа</p>;

    const isRestricted = tubshin === 2;

    const btnEdit = () => {
        setIsEditBtnClick(true);
    };

    const btnDelete = () => {
        if (!getRowsSelected.length) return;

        Swal.fire({
            title: "Та устгахдаа итгэлтэй байна уу?",
            showCancelButton: true,
            confirmButtonText: "Тийм",
            cancelButtonText: "Үгүй",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post("/delete/TurNuuts", {
                        id: getTurNuuts[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshTurNuuts();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    const columns = [
        {
            name: "id",
            label: "№",
            options: {
                filter: true,
                sort: true,
                filter: false,
                align: "center",
                customBodyRenderLite: (rowIndex) => {
                    if (rowIndex == 0) {
                        return rowIndex + 1;
                    } else {
                        return rowIndex + 1;
                    }
                },
                setCellProps: () => {
                    return { align: "center" };
                },
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                            width: 50,
                        },
                    };
                },
            },
        },
        {
            name: "hn_dd",
            label: "Дугаар",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "hn_zbn",
            label: "Зохион байгуулалтын нэгжийн нэр",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "hereg_burgtel",
            label: "Хэрэг,данс бүртгэлийн №",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },
        {
            name: "harya_on",
            label: "Хэрэг бүртгэлийн он",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "hn_garchig",
            label: "Хэрэг данс бүртгэлийн нэр",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "nuuts_zereglel",
            label: "Нууцын зэрэглэл",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "on_ehen",
            label: "Эхэлсэн он,сар,өдөр",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "on_suul",
            label: "Дууссан он,сар,өдөр",
            options: {
                customBodyRenderLite: (rowIndex) => {
                    const row = getTurNuuts[rowIndex]; // ✅ OK
                    const expired = isExpiredRow(row); // ✅ OK

                    return (
                        <span
                            style={{
                                color: expired ? "#dc2626" : "inherit",
                                fontWeight: expired ? 600 : "normal",
                            }}
                        >
                            {row?.on_suul}
                            {expired && " (хугацаа хэтэрсэн)"}
                        </span>
                    );
                },
            },
        },
        {
            name: "huudas_too",
            label: "Хуудасны тоо",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "habsralt_too",
            label: "Хавсралтын тоо",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },

        {
            name: "jagsaalt_zuildugaar",
            label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: () => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
                customBodyRender: (value) => {
                    if (
                        value === null ||
                        value === "" ||
                        value === 0 ||
                        value === undefined
                    ) {
                        return "-";
                    }
                    return value;
                },
            },
        },

        {
            name: "hn_tailbar",
            label: "Тайлбар",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => {
                    return {
                        style: {
                            backgroundColor: "#5DADE2",
                            color: "white",
                        },
                    };
                },
            },
        },
    ];

    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h4 className="text-center  mb-4">
                            Түр хадгалагдах хадгаламжийн нэгж, баримт
                            бичиг/нууц/{" "}
                        </h4>
                        {/* DATE FILTER */}
                        <div className="col-md-8 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    Хөмрөг:
                                </span>

                                <select
                                    className="form-control"
                                    value={selectedHumrug}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSelectedHumrug(value);

                                        // 0 сонгосон бол alert
                                        if (value === 0) {
                                            Swal.fire({
                                                icon: "warning",
                                                title: "Анхаар!",
                                                text: "Хөмрөгийг сонгоно уу",
                                            });
                                        }
                                    }}
                                >
                                    <option value={0}>Сонгоно уу</option>
                                    {getHumrug.map((el) => (
                                        <option key={el.id} value={el.id}>
                                            {el.humrug_ner}
                                        </option>
                                    ))}
                                </select>
                                <span className="mx-2"></span>
                                <span className="input-group-text">
                                    Дансны дугаар:
                                </span>

                                <select
                                    className="form-control"
                                    value={selectedDans}
                                    onChange={(e) =>
                                        setselectedDans(Number(e.target.value))
                                    }
                                    disabled={
                                        selectedHumrug === 0 || !getDans.length
                                    } // Хөмрөг сонгогдоогүй бол хаалттай
                                >
                                    <option value={0}>
                                        {selectedHumrug === 0
                                            ? "Хөмрөг сонгоно уу"
                                            : getDans.length
                                            ? "Сонгоно уу"
                                            : "Хоосон байна"}
                                    </option>

                                    {getDans.map((el) => (
                                        <option key={el.id} value={el.id}>
                                            {el.dans_ner}
                                        </option>
                                    ))}
                                </select>
                                <span className="mx-2"></span>
                                <button
                                    className="btn d-flex align-items-center gap-2 px-4 py-2 fw-bold"
                                    disabled={
                                        selectedHumrug === 0 ||
                                        selectedDans === 0
                                    }
                                    onClick={() => {
                                        if (
                                            selectedHumrug === 0 ||
                                            selectedDans === 0
                                        ) {
                                            Swal.fire({
                                                icon: "warning",
                                                title: "Анхаар!",
                                                text: "Хөмрөг болон данс сонгоно уу",
                                            });
                                            return;
                                        }
                                        setShowShiljuulehModal(true);
                                    }}
                                    style={{
                                        borderRadius: "0.6rem",
                                        background:
                                            selectedHumrug === 0 ||
                                            selectedDans === 0
                                                ? "#e2e8f0" // disabled gray
                                                : "#3b82f6", // soft blue
                                        color:
                                            selectedHumrug === 0 ||
                                            selectedDans === 0
                                                ? "#94a3b8"
                                                : "#fff",
                                        border: "none",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                        transition: "all 0.25s ease",
                                        cursor:
                                            selectedHumrug === 0 ||
                                            selectedDans === 0
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (
                                            !(
                                                selectedHumrug === 0 ||
                                                selectedDans === 0
                                            )
                                        ) {
                                            e.currentTarget.style.transform =
                                                "translateY(-2px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 14px rgba(0,0,0,0.18)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 2px 8px rgba(0,0,0,0.12)";
                                    }}
                                >
                                    <i className="fas fa-file-export"></i> 📂
                                    Архивт шилжүүлэх
                                </button>

                                {/* <select
                                    className="form-control"
                                    value={selectedDans}
                                    onChange={(e) =>
                                        setselectedDans(Number(e.target.value))
                                    }
                                    disabled={!getDans.length}
                                >
                                    <option value={0}>Сонгоно уу</option>
                                    {getDans.map((el) => (
                                        <option key={el.id} value={el.id}>
                                            {el.dans_ner}
                                        </option>
                                    ))}
                                </select> */}
                            </div>
                        </div>

                        <div className="labelWrapper">
                            <div className={`tab-indicator ${activeTab}`} />

                            <button
                                className={`labelBtn ${
                                    activeTab === "ilt" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("ilt")}
                            >
                                📊 Нууц
                            </button>

                            <button
                                className={`labelBtn ${
                                    activeTab === "barimt" ? "active" : ""
                                }`}
                                onClick={() => {
                                    if (!clickedRowData) {
                                        Swal.fire("Илт мөр сонгоно уу!");
                                        return;
                                    }
                                    setActiveTab("barimt");
                                }}
                            >
                                📂Баримт бичиг
                            </button>
                        </div>
                        {expiredCount > 0 && (
                            <div
                                style={{
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                    border: "1px solid #fca5a5",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    marginBottom: "12px",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                ⚠️ Хадгалалтын хугацаа хэтэрсэн баримт:{" "}
                                <strong>{expiredCount}</strong>
                            </div>
                        )}
                        {/* TABLE */}
                        {activeTab === "ilt" && (
                            <>
                                <div
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: "12px",
                                        border: "1px solid #e2e8f0",
                                        overflow: "hidden", // 🔥 чухал (table тасрахгүй)
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "14px 18px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottom: "1px solid #e2e8f0",
                                            background: "#f8fafc",
                                        }}
                                    >
                                        <div className="excel-bar">
                                            {/* <div className="excel-left"></div> */}

                                            <div className="excel-right">
                                                <span className="excel-label">
                                                    📊 Excel:
                                                </span>
                                                <input
                                                    type="file"
                                                    id="BainNuutsExcel"
                                                    accept=".xlsx,.xls,.csv"
                                                    disabled={isDisabled}
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.files
                                                                .length
                                                        ) {
                                                            setSelectedFile(
                                                                e.target
                                                                    .files[0]
                                                            );
                                                        }
                                                    }}
                                                />

                                                {selectedFile && (
                                                    <>
                                                        <button
                                                            className="btn-preview"
                                                            onClick={() =>
                                                                handlePreview(
                                                                    selectedFile
                                                                )
                                                            }
                                                        >
                                                            👁
                                                        </button>

                                                        <button
                                                            className="btn-import"
                                                            onClick={() => {
                                                                importExcel(
                                                                    selectedFile
                                                                );
                                                                setSelectedFile(
                                                                    null
                                                                );
                                                                document.getElementById(
                                                                    "BainNuutsExcel"
                                                                ).value = null;
                                                            }}
                                                        >
                                                            ⬆ Import
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {showPreviewModal && (
                                        <div
                                            className="modal fade show d-block"
                                            style={{
                                                backgroundColor:
                                                    "rgba(0,0,0,0.5)",
                                            }}
                                        >
                                            <div className="modal-dialog modal-xl">
                                                <div className="modal-content">
                                                    <div className="modal-header bg-primary text-white">
                                                        <h5 className="modal-title">
                                                            📊 Excel урьдчилж
                                                            харах
                                                        </h5>

                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            onClick={() =>
                                                                setShowPreviewModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <div className="px-3 py-2 border-bottom bg-light d-flex gap-3 flex-wrap">
                                                        <span className="badge bg-primary fs-6">
                                                            📁 Хөмрөг:{" "}
                                                            {selectedHumrugName ||
                                                                "-"}
                                                        </span>

                                                        <span className="badge bg-success fs-6">
                                                            📂 Данс:{" "}
                                                            {selectedDansName ||
                                                                "-"}
                                                        </span>
                                                    </div>

                                                    <div className="modal-body p-0">
                                                        <div
                                                            style={{
                                                                maxHeight:
                                                                    "60vh",
                                                                overflow:
                                                                    "auto",
                                                            }}
                                                        >
                                                            <table className="table table-bordered table-hover mb-0">
                                                                <thead
                                                                    className="table-dark"
                                                                    style={{
                                                                        position:
                                                                            "sticky",
                                                                        top: 0,
                                                                        zIndex: 1,
                                                                    }}
                                                                >
                                                                    <tr>
                                                                        {excelHeaders.map(
                                                                            (
                                                                                col,
                                                                                i
                                                                            ) => (
                                                                                <th
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="text-nowrap"
                                                                                >
                                                                                    {
                                                                                        col.label
                                                                                    }
                                                                                </th>
                                                                            )
                                                                        )}
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {previewData
                                                                        .slice(
                                                                            1
                                                                        )
                                                                        .map(
                                                                            (
                                                                                row,
                                                                                i
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                >
                                                                                    {excelHeaders.map(
                                                                                        (
                                                                                            col,
                                                                                            j
                                                                                        ) => (
                                                                                            <td
                                                                                                key={
                                                                                                    j
                                                                                                }
                                                                                                className="text-nowrap"
                                                                                            >
                                                                                                {row[
                                                                                                    j
                                                                                                ] ??
                                                                                                    ""}
                                                                                            </td>
                                                                                        )
                                                                                    )}
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() =>
                                                                setShowPreviewModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Хаах
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ padding: "10px" }}>
                                        <MUIDatatable
                                            data={getTurNuuts}
                                            setdata={setTurNuuts}
                                            columns={columns}
                                            options={{
                                                setRowProps: (
                                                    row,
                                                    dataIndex
                                                ) => {
                                                    const r =
                                                        getTurNuuts[dataIndex];
                                                    if (isExpiredRow(r)) {
                                                        return {
                                                            style: {
                                                                backgroundColor:
                                                                    "#fee2e2",
                                                            },
                                                        };
                                                    }
                                                },
                                            }}
                                            costumToolbar={
                                                <CustomToolbar
                                                    btnClassName="btn btn-success"
                                                    modelType="modal"
                                                    dataTargetID={
                                                        selectedHumrug !== 0 &&
                                                        selectedDans !== 0
                                                            ? "#TurNuutsNew"
                                                            : null
                                                    }
                                                    spanIconClassName="fas fa-plus"
                                                    buttonName="Нэмэх"
                                                    excelDownloadData={
                                                        getTurNuuts
                                                    }
                                                    excelHeaders={excelHeaders}
                                                    excelTitle="Түр хадгалагдах хадгаламжийн нэгж /нууц/"
                                                    isHideInsert={isRestricted}
                                                    isHideEdit={isRestricted}
                                                    onClick={() => {
                                                        if (
                                                            selectedHumrug ===
                                                                0 ||
                                                            selectedDans === 0
                                                        ) {
                                                            // Сонголт хийгээгүй бол зөвхөн анхааруулах
                                                            Swal.fire({
                                                                icon: "warning",
                                                                title: "Анхааруулга",
                                                                text: "Хөмрөг болон дансны дугаар сонгоно уу!",
                                                            });
                                                        }
                                                        // else блокоор modal автоматаар нээгдэх учраас өөр юу ч хийх шаардлагагүй
                                                    }}
                                                />
                                            }
                                            btnEdit={btnEdit}
                                            modelType={showModal}
                                            editdataTargetID="#TurNuutsEdit"
                                            btnDelete={btnDelete}
                                            getRowsSelected={getRowsSelected}
                                            setRowsSelected={setRowsSelected}
                                            isHideDelete={isRestricted}
                                            isHideEdit={isRestricted}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <TurNuutsNew
                            refreshTurNuuts={refreshTurNuuts}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                        />
                        <TurNuutsEdit
                            setRowsSelected={setRowsSelected}
                            refreshTurNuuts={refreshTurNuuts}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />
                        {/* <BaingaHadgalahHugatsaa /> */}
                    </div>
                </div>
            </div>

            {activeTab === "barimt" && (
                <>
                    {clickedRowData ? (
                        <TurNuutsChild changeDataRow={clickedRowData} />
                    ) : (
                        <div className="text-center p-5">
                            Илт мөр сонгоно уу
                        </div>
                    )}
                </>
            )}
            {/* <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card2">
                        {clickedRowData && (
                            <TurNuutsChild changeDataRow={clickedRowData} />
                        )}
                    </div>
                </div>
            </div> */}
            {showShiljuulehModal && getTurNuuts.length > 0 && (
                <TurNuutsShiljuuleh
                    selectedHumrug={selectedHumrug}
                    selectedDans={selectedDans}
                    getTurNuuts={getTurNuuts}
                    getRowsSelected={getRowsSelected}
                    setRowsSelected={setRowsSelected}
                    // clickedRowData={getTurNuuts[0]} // Эхний мөрийг автоматаар дамжуулж байна
                    onClose={() => setShowShiljuulehModal(false)}
                    refreshTurNuuts={refreshTurNuuts}
                />
            )}
        </>
    );
};

export default Index;

const excelHeaders = [
    { label: "Дугаар", key: "hn_dd" },
    { label: "Зохион байгуулалтын нэгжийн нэр", key: "hn_zbn" },
    { label: "Хэрэг,данс бүотгэлийн №", key: "hereg_burgtel" },
    { label: "Хэрэг бүртгэлийн он", key: "harya_on" },
    { label: "Хэрэг данс бүртгэлийн нэр", key: "hn_garchig" },
    { label: "Нууцын зэрэглэл ", key: "nuuts_zereglel" },
    { label: "Эхэлсэн он,сар,өдөр", key: "on_ehen" },
    { label: "Дууссан он,сар,өдөр", key: "on_suul" },
    { label: "Хуудасны тоо", key: "huudas_too" },
    { label: "Хавсралтын тоо", key: "habsralt_too" },
    {
        label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар",
        key: "jagsaalt_zuildugaar",
    },
    { label: "Тайлбар", key: "hn_tailbar" },
];
