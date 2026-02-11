import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
// import BaingaHadgalahHugatsaa from "../BaingaIlts/BaingaHadgalahHugatsaa";
import TurNuutsChild from "./TurNuutsChild";
import TurNuutsEdit from "./TurNuutsEdit";
import TurNuutsNew from "./TurNuutsNew";
import TurNuutsShiljuuleh from "./TurNuutsShiljuuleh";

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
    const [showShiljuulehModal, setShowShiljuulehModal] = useState(false);

    const [showModal] = useState("modal");

    useEffect(() => {
        refreshTurNuuts();
    }, [selectedHumrug, selectedDans]);

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
    //  ROW SELECT
    // useEffect(() => {
    //     if (getRowsSelected[0] !== undefined) {
    //         setIsEditBtnClick(false);
    //         setclickedRowData(getTurNuuts[getRowsSelected[0]]);
    //     }
    // }, [getRowsSelected, getTurNuuts]);

    // useEffect(() => {
    //     if (selectedHumrug === 0 || selectedDans === 0) {
    //         setTurNuuts([]);
    //         return;
    //     }

    //     const filteredData = allDans.filter(
    //         (item) =>
    //             Number(item.humrugID) === Number(selectedHumrug) &&
    //             Number(item.hadgalah_hugatsaa) === Number(selectedDans)
    //     );

    //     setTurNuuts(filteredData);
    // }, [selectedHumrug, selectedDans, allDans]);

    // useEffect(() => {
    //     let filteredData = allDans;

    //     if (selectedHumrug !== 0) {
    //         filteredData = filteredData.filter(
    //             (item) => Number(item.humrugID) === Number(selectedHumrug)
    //         );
    //     }

    //     if (selectedDans !== 0) {
    //         filteredData = filteredData.filter(
    //             (item) =>
    //                 Number(item.hadgalah_hugatsaa) === Number(selectedDans)
    //         );
    //     }

    //     setTurNuuts(filteredData);
    // }, [selectedHumrug, selectedDans, allDans]);
    // useEffect(() => {
    //     if (!isFilterActive) {
    //         setTurNuuts(allHumrug);
    //         return;
    //     }
    // }, [allHumrug]);

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
                        <h1 className="text-center  mb-4">
                            Түр хадгалагдах хадгаламжийн нэгж, баримт
                            бичиг/нууц/{" "}
                        </h1>
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
                        <MUIDatatable
                            data={getTurNuuts}
                            setdata={setTurNuuts}
                            columns={columns}
                            options={{
                                setRowProps: (row, dataIndex) => {
                                    const r = getTurNuuts[dataIndex];
                                    if (isExpiredRow(r)) {
                                        return {
                                            style: {
                                                backgroundColor: "#fee2e2",
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
                                    excelDownloadData={getTurNuuts}
                                    excelHeaders={excelHeaders}
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
                            isHideDelete={true}
                            isHideEdit={true}
                        />
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
            <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card2">
                        {clickedRowData && (
                            <TurNuutsChild changeDataRow={clickedRowData} />
                        )}
                    </div>
                </div>
            </div>
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
