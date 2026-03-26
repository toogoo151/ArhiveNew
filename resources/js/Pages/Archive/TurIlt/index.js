import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
// import BaingaHadgalahHugatsaa from "./BaingaHadgalahHugatsaa";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import "./Index.css";
import TurHadgalahHugatsaa from "./TurHadgalahHugatsaa";
import TurIltEdit from "./TurIltEdit";
import TurIltNew from "./TurIltNew";
import TurIltsChild from "./TurIltsChild";
import TurIltShiljuuleh from "./TurIltShiljuuleh";

const Index = () => {
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    // const [isFilterActive, setIsFilterActive] = useState(false);

    const [getTurIlt, setTurIlt] = useState([]);
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
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    // const [showShiljuuleh, setShowShiljuuleh] = useState(false);
    // const [comment, setComment] = useState("");
    // const [shiljuulehMode, setShiljuulehMode] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [activeTab, setActiveTab] = useState("ilt");
    const [showShiljuulehModal, setShowShiljuulehModal] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const isDisabled = selectedHumrug === 0 || selectedDans === 0;

    const [showModal] = useState("modal");

    useEffect(() => {
        if (getTurIlt.length) {
            console.log("ROW SAMPLE:", getTurIlt[0]);
            console.log("EXPIRED:", isExpiredRow(getTurIlt[0]));
        }
    }, [getTurIlt]);

    useEffect(() => {
        setSelectedFile(null);
        const input = document.getElementById("TurIlts");
        if (input) input.value = null;
    }, [selectedHumrug, selectedDans]);

    useEffect(() => {
        refreshTurIlt();
        console.log(getDans);
    }, [selectedHumrug, selectedDans]);

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
    const expiredCount = getTurIlt.filter(isExpiredRow).length;

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
            .post("/import/turIlt", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshTurIlt(); // <-- Table refresh хийж өгөгдөл шинэчлэгдэх
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };

    const refreshTurIlt = () => {
        axios.get("/get/TurIlt").then((res) => {
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

                setTurIlt(filteredData);
            } else {
                setTurIlt([]);
            }
        });
    };

    const btnArchive = () => {
        if (!clickedRowData) return;

        setShowArchiveModal(true);
        // setShowShiljuuleh(false);
    };

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
            .get(`/get/DansburtgelTurIlt/${selectedHumrug}`)
            .then((res) => {
                setDans(res.data);
                console.log("DANS RESPONSE:", res.data);
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

        if (rowIndex !== undefined && getTurIlt[rowIndex] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getTurIlt[rowIndex]);
        } else {
            setclickedRowData(null);
        }
    }, [getRowsSelected, getTurIlt]);
    // useEffect(() => {
    //     if (showShiljuuleh) {
    //         setComment("");
    //     }
    // }, [showShiljuuleh]);

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
                    .post("/delete/TurIlt", {
                        id: getTurIlt[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshTurIlt();
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
            name: "hadgalamj_dugaar",
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
            name: "hadgalamj_garchig",
            label: "Хадгаламжийн нэгжийн гарчиг",
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
            name: "hadgalamj_zbn",
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
            name: "hergiin_indeks",
            label: "Хэргийн индекс",
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
            label: "Харьяа он",
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
                    const row = getTurIlt[rowIndex]; // ✅ OK
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
    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h4 className="text-center mb-4">
                            Түр хадгалагдах хадгаламжийн нэгж, баримт бичиг/илт/{" "}
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
                                📊 Илт
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
                                                    id="TurIltsExcel"
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
                                                                    "TurIltsExcel"
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
                                            data={getTurIlt}
                                            setdata={setTurIlt}
                                            columns={columns}
                                            options={{
                                                setRowProps: (
                                                    row,
                                                    dataIndex
                                                ) => {
                                                    const r =
                                                        getTurIlt[dataIndex];
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
                                                            ? "#TurNew"
                                                            : null
                                                    }
                                                    spanIconClassName="fas fa-plus"
                                                    buttonName="Нэмэх"
                                                    excelDownloadData={
                                                        getTurIlt
                                                    }
                                                    excelHeaders={excelHeaders}
                                                    excelTitle="Түр хадгалагдах хадгаламжийн нэгж /илт/"
                                                    isHideInsert={true}
                                                    onClick={() => {
                                                        if (
                                                            selectedHumrug ===
                                                                0 ||
                                                            selectedDans === 0
                                                        ) {
                                                            Swal.fire({
                                                                icon: "warning",
                                                                title: "Анхааруулга",
                                                                text: "Хөмрөг болон дансны дугаар сонгоно уу!",
                                                            });
                                                        }
                                                    }}
                                                />
                                            }
                                            btnEdit={btnEdit}
                                            modelType={showModal}
                                            editdataTargetID="#turIltEdit"
                                            btnDelete={btnDelete}
                                            btnArchiveClick={btnArchive}
                                            getRowsSelected={getRowsSelected}
                                            setRowsSelected={setRowsSelected}
                                            isHideDelete={true}
                                            isHideEdit={true}
                                            showArchive={false}
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-md-12 mb-3">
                                    <label
                                        htmlFor="TurIlts"
                                        className="form-label"
                                    >
                                        Excel Import
                                    </label>
                                    <div className="d-flex align-items-center">
                                        <input
                                            style={{
                                                cursor: isDisabled
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: isDisabled ? 0.6 : 1,
                                            }}
                                            type="file"
                                            id="TurIlts"
                                            className="form-control form-control-sm me-2"
                                            accept=".xlsx,.xls,.csv"
                                            disabled={isDisabled}
                                            onChange={(e) => {
                                                if (e.target.files.length) {
                                                    const file =
                                                        e.target.files[0];
                                                    setSelectedFile(file);
                                                }
                                            }}
                                        />

                                        {!isDisabled && selectedFile && (
                                            <>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm me-2"
                                                    onClick={() =>
                                                        handlePreview(
                                                            selectedFile
                                                        )
                                                    }
                                                >
                                                    👁
                                                </button>

                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        importExcel(
                                                            selectedFile
                                                        );
                                                        setSelectedFile(null);
                                                        document.getElementById(
                                                            "TurIlts"
                                                        ).value = null;
                                                    }}
                                                >
                                                    Import
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div> */}

                                {/* {showPreviewModal && (
                                    <div
                                        className="modal fade show d-block"
                                        style={{
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        <div className="modal-dialog modal-xl">
                                            <div className="modal-content">
                                                <div className="modal-header bg-primary text-white">
                                                    <h5 className="modal-title">
                                                        📊 Excel урьдчилж харах
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
                                                            maxHeight: "60vh",
                                                            overflow: "auto",
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
                                                                    .slice(1)
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
                                )} */}
                            </>
                        )}
                        <TurIltNew
                            refreshTurIlt={refreshTurIlt}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                        />
                        <TurIltEdit
                            setRowsSelected={setRowsSelected}
                            refreshTurIlt={refreshTurIlt}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />

                        <TurHadgalahHugatsaa />
                    </div>
                </div>
            </div>

            {activeTab === "barimt" && (
                <>
                    {clickedRowData ? (
                        <TurIltsChild changeDataRow={clickedRowData} />
                    ) : (
                        <div className="text-center p-5">
                            Илт мөр сонгоно уу
                        </div>
                    )}
                </>
            )}

            {showShiljuulehModal && getTurIlt.length > 0 && (
                <TurIltShiljuuleh
                    selectedHumrug={selectedHumrug}
                    selectedDans={selectedDans}
                    getTurIlt={getTurIlt}
                    getRowsSelected={getRowsSelected}
                    setRowsSelected={setRowsSelected}
                    // clickedRowData={getTurIlt[0]} // Эхний мөрийг автоматаар дамжуулж байна
                    onClose={() => setShowShiljuulehModal(false)}
                    refreshTurIlt={refreshTurIlt}
                />
            )}
        </>
    );
};

export default Index;

const excelHeaders = [
    { label: "Дугаар", key: "hadgalamj_dugaar" },
    { label: "Хадгаламжийн нэгжийн гарчиг", key: "hadgalamj_garchig" },
    { label: "Зохион байгуулалтын нэгжийн нэр", key: "hadgalamj_zbn" },
    { label: "Хэргийн индекс", key: "hergiin_indeks" },
    { label: "Харьяа он ", key: "harya_on" },
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
