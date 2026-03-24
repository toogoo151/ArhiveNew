import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import BaingaHadgalahHugatsaa from "./BaingaHadgalahHugatsaa";
import BaingaIltsChild from "./BaingaIltsChild";
import BaingaIltsEdit from "./BaingaIltsEdit";
import BaingaIltShiljuuleh from "./BaingaIltShiljuuleh";
import BaingaIltsNew from "./BaingaIltsNew";
import "./Index.css";

const Index = () => {
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    const [getBaingaIlt, setBaingaIlt] = useState([]);
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
    const [activeTab, setActiveTab] = useState("ilt");
    const [selectedFile, setSelectedFile] = useState(null);

    // const [showShiljuuleh, setShowShiljuuleh] = useState(false);
    // const [comment, setComment] = useState("");
    // const [shiljuulehMode, setShiljuulehMode] = useState(null);

    const [showShiljuulehModal, setShowShiljuulehModal] = useState(false);

    const [showModal] = useState("modal");

    // useEffect(() => {
    //     setRowsSelected([]);
    // }, [activeTab]);

    useEffect(() => {
        if (getBaingaIlt.length) {
            console.log("ROW SAMPLE:", getBaingaIlt[0]);
            console.log("EXPIRED:", isExpiredRow(getBaingaIlt[0]));
        }
    }, [getBaingaIlt]);
    useEffect(() => {
        refreshBaingaIlt();
        console.log(getDans);
    }, [selectedHumrug, selectedDans]);

    const importExcel = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        axios
            .post("/import/baingaIlts", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshBaingaIlt(); // <-- Table refresh хийж өгөгдөл шинэчлэгдэх
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };

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
    const expiredCount = getBaingaIlt.filter(isExpiredRow).length;

    const refreshBaingaIlt = () => {
        axios.get("/get/BaingaIlt").then((res) => {
            const reversed = [...res.data].reverse();
            setAllDans(res.data); // бүх анхны дата-г хадгалах

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

                setBaingaIlt(filteredData);
            } else {
                setBaingaIlt([]);
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
            .get(`/get/Dansburtgel/${selectedHumrug}`)
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

        if (rowIndex !== undefined && getBaingaIlt[rowIndex] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getBaingaIlt[rowIndex]);
        } else {
            setclickedRowData(null);
        }
    }, [getRowsSelected, getBaingaIlt]);
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
                    .post("/delete/BaingaIlt", {
                        id: getBaingaIlt[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshBaingaIlt();
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
                customBodyRenderLite: (rowIndex, dataIndex) => {
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
                    const row = getBaingaIlt[rowIndex]; // ✅ OK
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
                        <h1 className="text-center mb-4">Лавлагаа татах</h1>
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
                                        <option
                                            key={el.desk_id}
                                            value={el.desk_id}
                                        >
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
                                        <option
                                            key={el.desk_id}
                                            value={el.desk_id}
                                        >
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
                                <div className="col-md-12 mb-3">
                                    <label
                                        htmlFor="BainIltsExcel"
                                        className="form-label"
                                    >
                                        Excel Import
                                    </label>
                                    <div className="d-flex align-items-center">
                                        {/* Файл сонгох input */}
                                        <input
                                            type="file"
                                            id="BainIltsExcel"
                                            className="form-control form-control-sm me-2"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={(e) => {
                                                if (e.target.files.length)
                                                    setSelectedFile(
                                                        e.target.files[0]
                                                    );
                                            }}
                                        />

                                        {/* Файл сонгогдсон үед л Import товч гарч ирнэ */}
                                        {selectedFile && (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    importExcel(selectedFile); // Excel импортлох функц дуудна
                                                    setSelectedFile(null); // файлыг цэвэрлэх
                                                    document.getElementById(
                                                        "BainIltsExcel"
                                                    ).value = null; // input-ыг цэвэрлэх
                                                }}
                                            >
                                                Import
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <MUIDatatable
                                    data={getBaingaIlt}
                                    setdata={setBaingaIlt}
                                    columns={columns}
                                    options={{
                                        setRowProps: (row, dataIndex) => {
                                            const r = getBaingaIlt[dataIndex];
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
                                                    ? "#BaingaNew"
                                                    : null
                                            }
                                            spanIconClassName="fas fa-plus"
                                            buttonName="Нэмэх"
                                            excelDownloadData={getBaingaIlt}
                                            excelHeaders={excelHeaders}
                                            excelTitle="Байнга хадгалагдах хадгаламжийн нэгж /илт/"
                                            isHideInsert={true}
                                        />
                                    }
                                    btnEdit={btnEdit}
                                    modelType={showModal}
                                    editdataTargetID="#baingaIltedit"
                                    btnDelete={btnDelete}
                                    getRowsSelected={getRowsSelected}
                                    setRowsSelected={setRowsSelected}
                                    isHideDelete={true}
                                    isHideEdit={true}
                                    showArchive={false}
                                />
                            </>
                        )}
                        <BaingaIltsNew
                            refreshBaingaIlt={refreshBaingaIlt}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                        />
                        <BaingaIltsEdit
                            setRowsSelected={setRowsSelected}
                            refreshBaingaIlt={refreshBaingaIlt}
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
                        <BaingaIltsChild changeDataRow={clickedRowData} />
                    ) : (
                        <div className="text-center p-5">
                            Илт мөр сонгоно уу
                        </div>
                    )}
                </>
            )}
            {/* {clickedRowData ? (
                <BaingaIltsChild changeDataRow={clickedRowData} />
            ) : (
                <div className="text-center p-5">Илт мөр сонгоно уу</div>
            )} */}
            {showShiljuulehModal && getBaingaIlt.length > 0 && (
                <BaingaIltShiljuuleh
                    selectedHumrug={selectedHumrug}
                    selectedDans={selectedDans}
                    getBaingaIlt={getBaingaIlt}
                    getRowsSelected={getRowsSelected}
                    setRowsSelected={setRowsSelected}
                    // clickedRowData={getBaingaIlt[0]} // Эхний мөрийг автоматаар дамжуулж байна
                    onClose={() => setShowShiljuulehModal(false)}
                    refreshBaingaIlt={refreshBaingaIlt}
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
