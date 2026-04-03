import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import Spinner from "../../../Spinner";
import useAuthPermission from "../../../useAuthPermission";
import BaingaHadgalahHugatsaa from "../BaingaIlts/BaingaHadgalahHugatsaa";
import DalanJilSanhuuChild from "./DalanJilSanhuuChild";
import DalanJilSanhuuEdit from "./DalanJilSanhuuEdit";
import DalanJilSanhuuNew from "./DalanJilSanhuuNew";
import DalanJilSanhuuShiljuuleh from "./DalanJilSanhuuShiljuuleh";
import "./Index.css";

const Index = () => {
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    // const [isFilterActive, setIsFilterActive] = useState(false);

    const [getDalSanhuu, setDalSanhuu] = useState([]);
    const [getHumrug, setHumrug] = useState([]);
    const [getDans, setDans] = useState([]);

    //select
    const [allDans, setAllDans] = useState([]); // анхны бүх дата
    const [selectedHumrug, setSelectedHumrug] = useState(0);
    const [selectedDans, setselectedDans] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    //select

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null); // анх null
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [activeTab, setActiveTab] = useState("ilt");
    const [previewData, setPreviewData] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const isDisabled = selectedHumrug === 0 || selectedDans === 0;

    const [showShiljuulehModal, setShowShiljuulehModal] = useState(false);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [showModal] = useState("modal");
    const { tubshin, loading, error } = useAuthPermission();

    useEffect(() => {
        if (selectedHumrug && selectedDans) {
            console.log("FETCH:", page, rowsPerPage);
            console.log("TOTAL:", total); // 18s
            console.log("DATA LENGTH:", getDalSanhuu.length); // 10
            console.log("PAGE:", page); // 0 эсвэл 1
            refreshDalSanhuu();
        }
    }, [selectedHumrug, selectedDans, page, rowsPerPage]);
    useEffect(() => {
        setSelectedFile(null);
        const input = document.getElementById("DalanJilSanhuu");
        if (input) input.value = null;
    }, [selectedHumrug, selectedDans]);

    useEffect(() => {
        console.log("UPDATED DATA:", getDalSanhuu);
        console.log("UPDATED TOTAL:", total);
    }, [getDalSanhuu, total]);

    useEffect(() => {
        setPage(0); // 🔥 reset page
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
    const expiredCount = getDalSanhuu.filter(isExpiredRow).length;

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
            .post("/import/DalanJilSanhuu", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshDalSanhuu(); // <-- Table refresh хийж өгөгдөл шинэчлэгдэх
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };

    const refreshDalSanhuu = async () => {
        try {
            const res = await axios.get("/get/DalanJilSanhuu", {
                params: {
                    humrug_id: selectedHumrug || null,
                    dans_id: selectedDans || null,
                    page: page + 1,
                    perPage: rowsPerPage,
                },
            });

            setAllDans(res.data.data); // бүх data
            setDalSanhuu(res.data.data); // filtered + expired sort
            setTotal(res.data.total); // pagination-д хэрэгтэй нийт record
        } catch (err) {
            console.error("Failed to fetch DalanJilSanhuu:", err);
        }
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
            .get(`/get/DansburtgelDalanjilSanhuu/${selectedHumrug}`)
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

        if (rowIndex !== undefined && getDalSanhuu[rowIndex] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getDalSanhuu[rowIndex]);
        } else {
            setclickedRowData(null);
        }
    }, [getRowsSelected, getDalSanhuu]);
    // useEffect(() => {
    //     if (showShiljuuleh) {
    //         setComment("");
    //     }
    // }, [showShiljuuleh]);

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
                    .post("/delete/DalanJilSanhuu", {
                        id: getDalSanhuu[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshDalSanhuu();
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
                    const row = getDalSanhuu[rowIndex]; // ✅ OK
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
                        <h4 className="text-center">
                            70 жил хадгалагдах хадгаламжийн нэгж, баримт
                            бичиг/Санхүү/{" "}
                        </h4>
                        {/* DATE FILTER */}
                        <div
                            className="col-md-8 mb-2"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                flexWrap: "wrap",
                                fontWeight: 500,
                                fontSize: "12px",
                            }}
                        >
                            <div className="input-group input-group-sm">
                                <span className="input-group-text py-1 px-2">
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
                                    Бүртгэлийн дугаар:
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
                                                text: "Хөмрөг болон бүртгэлийн дугаар сонгоно уу",
                                            });
                                            return;
                                        }

                                        setShowShiljuulehModal(true); // modal-г state-ээр харуулна
                                    }}
                                    style={{
                                        borderRadius: "0.6rem", // Булан тойруулж гаргах
                                        background:
                                            "linear-gradient(135deg, #1E90FF 0%, #0047AB 100%)",

                                        color: "#fff",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.15)", // subtle shadow
                                        transition: "all 0.3s ease", // smooth hover
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(-2px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 6px 16px rgba(0,0,0,0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 4px 12px rgba(0,0,0,0.15)";
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
                                📊 Санхүү
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
                                                    id="DalanjilSanhuu"
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
                                                                    "DalanjilSanhuu"
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
                                            data={getDalSanhuu}
                                            setdata={setDalSanhuu}
                                            columns={columns}
                                            options={{
                                                serverSide: true, // 🔥 ЧУХАЛ
                                                count: total, // нийт row
                                                page: page,
                                                rowsPerPage: rowsPerPage,

                                                onTableChange: (
                                                    action,
                                                    tableState
                                                ) => {
                                                    switch (action) {
                                                        case "changePage":
                                                            setPage(
                                                                tableState.page
                                                            );
                                                            break;

                                                        case "changeRowsPerPage":
                                                            setRowsPerPage(
                                                                tableState.rowsPerPage
                                                            );
                                                            setPage(0);
                                                            break;

                                                        default:
                                                            break;
                                                    }
                                                },

                                                setRowProps: (
                                                    row,
                                                    dataIndex
                                                ) => {
                                                    const r =
                                                        getDalHun[dataIndex];
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
                                                            ? "#DalanJilSanhuuNew"
                                                            : null
                                                    }
                                                    spanIconClassName="fas fa-plus"
                                                    buttonName="Нэмэх"
                                                    excelDownloadData={
                                                        getDalSanhuu
                                                    }
                                                    excelHeaders={excelHeaders}
                                                    excelTitle="70 жил хадгалагдах хадгаламжийн нэгж /Санхүү/"
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
                                                                text: "Хөмрөг болон бүртгэлийн дугаар сонгоно уу!",
                                                            });
                                                        }
                                                        // else блокоор modal автоматаар нээгдэх учраас өөр юу ч хийх шаардлагагүй
                                                    }}
                                                />
                                            }
                                            btnEdit={btnEdit}
                                            modelType={showModal}
                                            editdataTargetID="#DalanJilSanhuuEdit"
                                            btnDelete={btnDelete}
                                            btnArchiveClick={btnArchive}
                                            getRowsSelected={getRowsSelected}
                                            setRowsSelected={setRowsSelected}
                                            isHideDelete={isRestricted}
                                            isHideEdit={isRestricted}
                                            showArchive={false}
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-md-12 mb-3">
                                    <label
                                        htmlFor="DalanJilSanhuu"
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
                                            id="DalanJilSanhuu"
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
                                                            "DalanJilSanhuu"
                                                        ).value = null;
                                                    }}
                                                >
                                                    Import
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {showPreviewModal && (
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
                                )}
                                <MUIDatatable
                                    data={getDalSanhuu}
                                    setdata={setDalSanhuu}
                                    columns={columns}
                                    options={{
                                        setRowProps: (row, dataIndex) => {
                                            const r = getDalSanhuu[dataIndex];
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
                                                    ? "#DalanJilSanhuuNew"
                                                    : null
                                            }
                                            spanIconClassName="fas fa-plus"
                                            buttonName="Нэмэх"
                                            excelDownloadData={getDalSanhuu}
                                            excelHeaders={excelHeaders}
                                            excelTitle="70 жил хадгалагдах хадгаламжийн нэгж /Санхүү/"
                                            isHideInsert={true}
                                            onClick={() => {
                                                if (
                                                    selectedHumrug === 0 ||
                                                    selectedDans === 0
                                                ) {
                                                    // Сонголт хийгээгүй бол зөвхөн анхааруулах
                                                    Swal.fire({
                                                        icon: "warning",
                                                        title: "Анхааруулга",
                                                        text: "Хөмрөг болон бүртгэлийн дугаар сонгоно уу!",
                                                    });
                                                }
                                                // else блокоор modal автоматаар нээгдэх учраас өөр юу ч хийх шаардлагагүй
                                            }}
                                        />
                                    }
                                    btnEdit={btnEdit}
                                    modelType={showModal}
                                    editdataTargetID="#DalanJilSanhuuEdit"
                                    btnDelete={btnDelete}
                                    btnArchiveClick={btnArchive}
                                    getRowsSelected={getRowsSelected}
                                    setRowsSelected={setRowsSelected}
                                    isHideDelete={true}
                                    isHideEdit={true}
                                    showArchive={false}
                                /> */}
                            </>
                        )}
                        <DalanJilSanhuuNew
                            refreshDalSanhuu={refreshDalSanhuu}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                        />
                        <DalanJilSanhuuEdit
                            setRowsSelected={setRowsSelected}
                            refreshDalSanhuu={refreshDalSanhuu}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />

                        <BaingaHadgalahHugatsaa />
                    </div>
                </div>
            </div>

            {activeTab === "barimt" && (
                <>
                    {clickedRowData ? (
                        <DalanJilSanhuuChild changeDataRow={clickedRowData} />
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
                            <DalanJilSanhuuChild
                                changeDataRow={clickedRowData}
                            />
                        )}
                    </div>
                </div>
            </div> */}
            {showShiljuulehModal && getDalSanhuu.length > 0 && (
                <DalanJilSanhuuShiljuuleh
                    selectedHumrug={selectedHumrug}
                    selectedDans={selectedDans}
                    getDalSanhuu={getDalSanhuu}
                    getRowsSelected={getRowsSelected}
                    setRowsSelected={setRowsSelected}
                    // clickedRowData={getDalSanhuu[0]} // Эхний мөрийг автоматаар дамжуулж байна
                    onClose={() => setShowShiljuulehModal(false)}
                    refreshDalSanhuu={refreshDalSanhuu}
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
