import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import DansBurtgelEdit from "./DansBurtgelEdit";
import DansBurtgelNew from "./DansBurtgelNew";
import useAuthPermission from "../../../useAuthPermission";
import Spinner from "../../../Spinner";

const Index = () => {
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    // const [isFilterActive, setIsFilterActive] = useState(false);

    const [getDans, setDans] = useState([]);
    const [getHumrug, setHumrug] = useState([]);
    const [getRetention, setRetention] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    //select
    const [allDans, setAllDans] = useState([]); // анхны бүх дата
    const [selectedHumrug, setSelectedHumrug] = useState(0);
    const [selectedRetention, setSelectedRetention] = useState("");
    //select

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");
    const { tubshin, loading, error } = useAuthPermission();

    useEffect(() => {
        refreshDans();
    }, [selectedHumrug, selectedRetention]);

    const importExcel = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        axios
            .post("/import/dansburtgel", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshDans(); // <-- Table refresh хийж өгөгдөл шинэчлэгдэх
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };

    const refreshDans = () => {
        axios
            .get("/get/Dans")
            .then((res) => {
                // Давхар мөрийг зөвхөн 'id' дээр filter хийж авна
                const uniqueDans = Array.from(
                    new Map(res.data.map((item) => [item.id, item])).values()
                );

                setAllDans(uniqueDans);

                if (selectedHumrug !== 0 && selectedRetention !== "") {
                    const filteredData = uniqueDans.filter(
                        (item) =>
                            String(item.humrugID) === String(selectedHumrug) &&
                            String(item.hadgalah_hugatsaa) ===
                                String(selectedRetention)
                    );
                    setDans(filteredData);
                } else {
                    setDans([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // const handleAddClick = (e) => {
    //     if (selectedHumrug === 0 || selectedRetention === 0) {
    //         e.preventDefault();
    //         Swal.fire({
    //             icon: "warning",
    //             title: "Анхааруулга",
    //             text: "Хөмрөг болон хадгалах хугацааг сонгоно уу!",
    //         });
    //         return false;
    //     }
    // };

    // const refreshDans = () => {
    //     axios
    //         .get("/get/Dans")
    //         .then((res) => {
    //             setRowsSelected([]);
    //             setDans(res.data);
    //             setAllDans(res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

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
        axios
            .get("/get/Retention")
            .then((res) => {
                setRetention(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    //  ROW SELECT
    useEffect(() => {
        if (getRowsSelected[0] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getDans[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getDans]);
    console.log(selectedHumrug);
    console.log(selectedRetention);

    console.log("test" + getDans);
    // useEffect(() => {
    //     if (selectedHumrug === 0 || selectedRetention === 0) {
    //         setDans([]);
    //         return;
    //     }

    //     const filteredData = allDans.filter(
    //         (item) =>
    //             Number(item.humrugID) === Number(selectedHumrug) &&
    //             Number(item.hadgalah_hugatsaa) === Number(selectedRetention)
    //     );

    //     setDans(filteredData);
    // }, [selectedHumrug, selectedRetention, allDans]);

    // useEffect(() => {
    //     let filteredData = allDans;

    //     if (selectedHumrug !== 0) {
    //         filteredData = filteredData.filter(
    //             (item) => Number(item.humrugID) === Number(selectedHumrug)
    //         );
    //     }

    //     if (selectedRetention !== 0) {
    //         filteredData = filteredData.filter(
    //             (item) =>
    //                 Number(item.hadgalah_hugatsaa) === Number(selectedRetention)
    //         );
    //     }

    //     setDans(filteredData);
    // }, [selectedHumrug, selectedRetention, allDans]);
    // useEffect(() => {
    //     if (!isFilterActive) {
    //         setDans(allHumrug);
    //         return;
    //     }
    // }, [allHumrug]);

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
                    .post("/delete/dans", {
                        id: getDans[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshDans();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">Данс бүртгэл</h1>
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
                                    Хадгалах хугацаа:
                                </span>

                                <select
                                    className="form-control"
                                    value={selectedRetention}
                                    onChange={(e) => {
                                        const value = e.target.value; // STRING
                                        setSelectedRetention(value);

                                        if (value === "") {
                                            Swal.fire({
                                                icon: "warning",
                                                title: "Анхаар!",
                                                text: "Хадгалах хугацааг сонгоно уу",
                                            });
                                        }
                                    }}
                                >
                                    <option value="">Сонгоно уу</option>
                                    {getRetention.map((el) => (
                                        <option key={el.id} value={el.RetName}>
                                            {el.RetName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* TABLE */}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="danburtgel" className="form-label">
                                Excel Import
                            </label>
                            <div className="d-flex align-items-center">
                                {/* Файл сонгох input */}
                                <input
                                    type="file"
                                    id="danburtgel"
                                    className="form-control form-control-sm me-2"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        if (e.target.files.length)
                                            setSelectedFile(e.target.files[0]);
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
                                                "danburtgel"
                                            ).value = null; // input-ыг цэвэрлэх
                                        }}
                                    >
                                        Import
                                    </button>
                                )}
                            </div>
                        </div>

                        <MUIDatatable
                            data={getDans}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID={
                                        selectedHumrug !== 0 &&
                                        selectedRetention !== ""
                                            ? "#dansNew"
                                            : null
                                    }
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelDownloadData={getDans}
                                    excelHeaders={excelHeaders}
                                    excelTitle="Данс бүртгэл"
                                    isHideInsert={isRestricted}
                                    isHideEdit={isRestricted}
                                    onClick={() => {
                                        if (
                                            selectedHumrug === 0 ||
                                            selectedRetention === 0
                                        ) {
                                            // Сонголт хийгээгүй бол зөвхөн анхааруулах
                                            Swal.fire({
                                                icon: "warning",
                                                title: "Анхааруулга",
                                                text: "Хөмрөг болон хадгалах хугацааг сонгоно уу!",
                                            });
                                        }
                                        // else блокоор modal автоматаар нээгдэх учраас өөр юу ч хийх шаардлагагүй
                                    }}
                                />
                                // <CustomToolbar
                                //     btnClassName="btn btn-success"
                                //     modelType="modal"
                                //     dataTargetID="#dansNew"
                                //     spanIconClassName="fas fa-plus"
                                //     buttonName="НЭМЭХ"
                                //     excelDownloadData={getDans}
                                //     excelHeaders={excelHeaders}
                                //     isHideInsert={true}
                                //     onClick={handleAddClick}
                                // />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#dansburtgeledit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideInsert={isRestricted}
                            isHideEdit={isRestricted}
                        />
                        <DansBurtgelNew
                            refreshDans={refreshDans}
                            selectedHumrug={selectedHumrug}
                            selectedRetention={selectedRetention}
                        />
                        <DansBurtgelEdit
                            setRowsSelected={setRowsSelected}
                            refreshDans={refreshDans}
                            selectedHumrug={selectedHumrug}
                            selectedRetention={selectedRetention}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />
                        {/* <DansBurtgelNew refreshDans={refreshDans} /> */}
                        {/* <HumrugEdit
                            setRowsSelected={setRowsSelected}
                            refreshDans={refreshDans}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        /> */}
                        {/* console.log(res.data[0]) console.log(selectedRetention) */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;

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
        name: "dans_baidal",
        label: "Нууцын зэрэг",
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
        name: "dans_dugaar",
        label: "Бүртгэлийн дугаар",
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
        name: "dans_ner",
        label: "Бүртгэлийн нэр",
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
        name: "humrug_niit",
        label: "Хөмрөгийн нийт ХН",
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
        name: "dans_niit",
        label: "Тухайн дансны ХН",
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
        label: "Он хязгаар эхэн",
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
        label: "Он хязгаар сүүл",
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
        name: "hubi_dans",
        label: "Хэдэн хувь данс",
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
        name: "dans_tailbar",
        label: "Тайлбар",
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
];

const excelHeaders = [
    { label: "Нууцын зэрэг", key: "Sname" },
    { label: "Данс дугаар", key: "dans_dugaar" },
    { label: "Бүртгэлийн нэр", key: "dans_ner" },
    { label: "Хөмрөгийн нийт ХН", key: "humrug_niit" },
    { label: "Тухайн дансны ХН", key: "dans_niit" },
    { label: "Он хязгаар эхэн", key: "on_ehen" },
    { label: "Он хязгаар сүүл", key: "on_suul" },
    { label: "Хэдэн хувь данс", key: "hubi_dans" },
    { label: "Тайлбар", key: "dans_tailbar" },
];
