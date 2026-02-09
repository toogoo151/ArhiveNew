import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import BaingaHadgalahHugatsaa from "../BaingaIlts/BaingaHadgalahHugatsaa";
import DalanJilHunEdit from "./DalanJilHunEdit";
import DalanJilHunNew from "./DalanJilHunNew";
import DalanJilhunChild from "./DalanJilhunChild";
import DalanJilhunShiljuuleh from "./DalanJilhunShiljuuleh";

const Index = () => {
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    // const [isFilterActive, setIsFilterActive] = useState(false);

    const [getDalHun, setDalHun] = useState([]);
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

    const [showShiljuulehModal, setShowShiljuulehModal] = useState(false);

    const [showModal] = useState("modal");

    useEffect(() => {
        refreshDalHun();
        console.log(getDans);
    }, [selectedHumrug, selectedDans]);

    const refreshDalHun = () => {
        axios.get("/get/DalanJilHun").then((res) => {
            const reversed = [...res.data].reverse();
            setAllDans(res.data);

            if (selectedHumrug !== 0 && selectedDans !== 0) {
                const filteredData = res.data.filter(
                    (item) =>
                        Number(item.humrug_id) === Number(selectedHumrug) &&
                        Number(item.dans_id) === Number(selectedDans)
                );
                setDalHun(filteredData);
            } else {
                setDalHun([]);
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
            .get(`/get/DansburtgelDalanjilHun/${selectedHumrug}`)
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

        if (rowIndex !== undefined && getDalHun[rowIndex] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getDalHun[rowIndex]);
        } else {
            setclickedRowData(null);
        }
    }, [getRowsSelected, getDalHun]);
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
                    .post("/delete/DalanJilHun", {
                        id: getDalHun[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshDalHun();
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
                        <h1 className="text-center">
                            70 жил хадгалагдах хадгаламжийн нэгж, баримт
                            бичиг/Хүний нөөц/{" "}
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
                                    АРХИВТ ШИЛЖҮҮЛЭХ
                                </button>
                            </div>
                        </div>

                        <MUIDatatable
                            data={getDalHun}
                            setdata={setDalHun}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID={
                                        selectedHumrug !== 0 &&
                                        selectedDans !== 0
                                            ? "#DalanJilNew"
                                            : null
                                    }
                                    spanIconClassName="fas fa-plus"
                                    buttonName="НЭМЭХ"
                                    excelDownloadData={getDalHun}
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
                                                text: "Хөмрөг болон бүртгэлийн дугаар сонгоно уу!",
                                            });
                                        }
                                        // else блокоор modal автоматаар нээгдэх учраас өөр юу ч хийх шаардлагагүй
                                    }}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#DalanJilhunEdit"
                            btnDelete={btnDelete}
                            btnArchiveClick={btnArchive}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                            showArchive={false}
                        />
                        <DalanJilHunNew
                            refreshDalHun={refreshDalHun}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                        />
                        <DalanJilHunEdit
                            setRowsSelected={setRowsSelected}
                            refreshDalHun={refreshDalHun}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />

                        {/* <DalanJilhunShiljuuleh
                            setRowsSelected={setRowsSelected}
                            refreshDalHun={refreshDalHun}
                            selectedHumrug={selectedHumrug}
                            selectedDans={selectedDans}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        /> */}
                        <BaingaHadgalahHugatsaa />
                    </div>
                </div>
            </div>
            <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card2">
                        {clickedRowData && (
                            <DalanJilhunChild changeDataRow={clickedRowData} />
                        )}
                    </div>
                </div>
            </div>
            {showShiljuulehModal && getDalHun.length > 0 && (
                <DalanJilhunShiljuuleh
                    selectedHumrug={selectedHumrug}
                    selectedDans={selectedDans}
                    getDalHun={getDalHun}
                    getRowsSelected={getRowsSelected}
                    setRowsSelected={setRowsSelected}
                    // clickedRowData={getDalHun[0]} // Эхний мөрийг автоматаар дамжуулж байна
                    onClose={() => setShowShiljuulehModal(false)}
                    refreshDalHun={refreshDalHun}
                />
            )}
            {/* {showArchiveModal && clickedRowData && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(3px)",
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded shadow-lg border-0">
                            <div className="modal-header bg-gradient-primary text-white">
                                <h5 className="modal-title fw-bold">
                                    📂 Архивт шилжүүлэх
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowArchiveModal(false)}
                                />
                            </div>

                            <div className="px-4 py-3 bg-light border-bottom d-flex flex-wrap gap-3 align-items-center">
                                <span>
                                    <b>Хөмрөг:</b> {clickedRowData.humrug_ner}
                                </span>
                                <span>|</span>
                                <span>
                                    <b>Данс:</b> {clickedRowData.dans_ner}
                                </span>
                                <span>|</span>
                                <span>
                                    <b>ХН төрөл:</b>{" "}
                                    {clickedRowData.dans_baidal || "-"}
                                </span>
                                <span>|</span>
                                <span>
                                    <b>Нууцын зэрэг:</b>{" "}
                                    <span className="badge bg-warning text-dark">
                                        {clickedRowData.hadgalah_hugatsaa ||
                                            "-"}
                                    </span>
                                </span>
                            </div>

                            <div
                                className="px-4 py-3"
                                style={{
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover table-sm align-middle mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th style={{ width: "35%" }}>
                                                    Талбар
                                                </th>
                                                <th>Утга</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Хадгаламжийн дугаар</td>
                                                <td>
                                                    {clickedRowData.hadgalamj_dugaar ||
                                                        "-"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Хадгаламжийн гарчиг</td>
                                                <td>
                                                    {clickedRowData.hadgalamj_garchig ||
                                                        "-"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Зохион байгуулалтын нэгжийн
                                                    нэр
                                                </td>
                                                <td>
                                                    {clickedRowData.hadgalamj_zbn ||
                                                        "-"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Хэргийн индекс</td>
                                                <td>
                                                    {clickedRowData.hergiin_indeks ||
                                                        "-"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Харьяа он</td>
                                                <td>
                                                    {clickedRowData.harya_on ||
                                                        "-"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Хуудасны тоо</td>
                                                <td>
                                                    {clickedRowData.huudas_too ||
                                                        "-"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="px-4 pb-4 d-flex flex-wrap gap-2 justify-content-end">
                                {!showShiljuuleh ? (
                                    <>
                                        <button
                                            className="btn btn-outline-danger d-flex align-items-center gap-2"
                                            onClick={() => {
                                                setShiljuulehMode("delete");
                                                setShowShiljuuleh(true);
                                            }}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                            Устгах жагсаалт болон акт үүсгэх
                                        </button>

                                        <button
                                            className="btn btn-success d-flex align-items-center gap-2"
                                            onClick={() =>
                                                setShowShiljuuleh(true)
                                            }
                                        >
                                            <i className="fas fa-file-export"></i>{" "}
                                            Архивт шилжүүлэх болон устгах
                                        </button>

                                        <button
                                            className="btn btn-outline-secondary d-flex align-items-center gap-2"
                                            onClick={() =>
                                                setShowArchiveModal(false)
                                            }
                                        >
                                            <i className="fas fa-times"></i>{" "}
                                            Болих
                                        </button>
                                    </>
                                ) : null}
                            </div>

                            {showShiljuuleh && (
                                <div className="px-4 pb-4">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="commentInput"
                                            className="form-label"
                                        >
                                            Устгасан буюу архивт шилжүүлсэн
                                            тухай тэмдэглэл оруулах:
                                        </label>
                                        <input
                                            type="text"
                                            id="commentInput"
                                            className="form-control"
                                            placeholder="Тэмдэглэл оруулна уу"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => {
                                                if (!comment.trim()) {
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: "Анхаар!",
                                                        text: "Тэмдэглэл хоосон байна",
                                                    });
                                                    return;
                                                }

                                                if (!clickedRowData?.id) return;

                                                axios
                                                    .post(
                                                        "/archive/BaingaIlt",
                                                        {
                                                            id: clickedRowData.id,
                                                            ustgasan_temdeglel:
                                                                comment.trim(),
                                                        }
                                                    )
                                                    .then((res) => {
                                                        Swal.fire({
                                                            icon: "success",
                                                            title:
                                                                res.data.msg ||
                                                                "Амжилттай хадгалагдлаа",
                                                        });
                                                        setShowShiljuuleh(
                                                            false
                                                        );
                                                        setComment("");
                                                        setShowArchiveModal(
                                                            false
                                                        ); // modal хаах
                                                        refreshDalHun();
                                                    })
                                                    .catch((err) => {
                                                        Swal.fire({
                                                            icon: "error",
                                                            title: "Алдаа гарлаа",
                                                            text:
                                                                err.response
                                                                    ?.data
                                                                    ?.msg || "",
                                                        });
                                                    });
                                            }}
                                        >
                                            Хадгалах
                                        </button>

                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowShiljuuleh(false)
                                            }
                                        >
                                            <i className="fas fa-times"></i>{" "}
                                            Болих
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="modal-body">
                                {showShiljuuleh && (
                                    <DalanJilhunShiljuuleh
                                        setRowsSelected={setRowsSelected}
                                        refreshDalHun={refreshDalHun}
                                        selectedHumrug={selectedHumrug}
                                        selectedDans={selectedDans}
                                        changeDataRow={clickedRowData}
                                        isEditBtnClick={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
            )} */}
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
