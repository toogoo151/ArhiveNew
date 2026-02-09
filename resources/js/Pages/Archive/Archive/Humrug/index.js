import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import HumrugEdit from "./HumrugEdit";
import HumrugNew from "./HumrugNew";

const Index = () => {
    // ================= DATE =================
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    const [getStartDate, setStartDate] = useState(defaultStart);
    const [getEndDate, setEndDate] = useState(defaultEnd);

    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);

    // ================= DATA =================
    const [allHumrug, setallHumrug] = useState([]);
    const [getHumrug, setHumrug] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    // FETCH
    useEffect(() => {
        refreshHumrug();
    }, []);

    const refreshHumrug = () => {
        axios
            .get("/get/Humrug")
            .then((res) => {
                setRowsSelected([]);
                setallHumrug(res.data);
                setHumrug(res.data); // анх бүх өгөгдөл
                setIsFilterActive(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //  ROW SELECT
    useEffect(() => {
        if (getRowsSelected[0] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getHumrug[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getHumrug]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setHumrug(allHumrug);
            return;
        }

        if (!getStartDate || !getEndDate) return;

        const start = new Date(getStartDate);
        const end = new Date(getEndDate);

        const filtered = allHumrug.filter((item) => {
            if (!item.ognoo) return false;
            const itemDate = new Date(item.ognoo);
            return itemDate >= start && itemDate <= end;
        });

        setHumrug(filtered);
    }, [isFilterActive, getStartDate, getEndDate, allHumrug]);

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
                    .post("/delete/humrug", {
                        id: getHumrug[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshHumrug();
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
                        <h1 className="text-center">Хөмрөг</h1>

                        {/* DATE FILTER */}
                        {/* <div className="col-md-8 mb-3">
                            <h5>
                                Хамрах хугацаа: {getStartDate} - {getEndDate}
                            </h5>

                            <div className="input-group">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={getStartDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                                <span className="mx-2">-</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={getEndDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />

                                <button
                                    className="btn btn-primary ms-2"
                                    onClick={() => setIsFilterActive(true)}
                                >
                                    Хайх
                                </button>

                            
                                <button
                                    className="btn btn-secondary ms-2"
                                    onClick={() => {
                                        setIsFilterActive(false);
                                        setStartDate(defaultStart);
                                        setEndDate(defaultEnd);
                                        setHumrug(allHumrug);
                                    }}
                                >
                                    Цэвэрлэх
                                </button>
                            </div>
                        </div> */}

                        {/* TABLE */}
                        <MUIDatatable
                            data={getHumrug}
                            setdata={setHumrug}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#humrugNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="НЭМЭХ"
                                    excelDownloadData={getHumrug}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#humrugedit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />

                        <HumrugNew refreshHumrug={refreshHumrug} />
                        <HumrugEdit
                            setRowsSelected={setRowsSelected}
                            refreshHumrug={refreshHumrug}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />
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
        name: "humrug_dugaar",
        label: "Хөмрөгийн дугаар",
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
        name: "humrug_ner",
        label: "Хөмрөг нэр",
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
        name: "humrug_zereglel",
        label: "Хөмрөгийн зэрэглэл",
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
        name: "anhnii_ognoo",
        label: "Архивт анх баримт шилжүүлсэн огноо",
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
        name: "humrug_uurchlult",
        label: "Хөмрөгийн өөрчлөлт",
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
        name: "uurchlult_ognoo",
        label: "Хөмрөгийн өөрчлөлтийн огноо",
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
        name: "humrug_tailbar",
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
    { label: "Хөмрөгийн дугаар", key: "humrug_dugaar" },
    { label: "Хөмрөгийн нэр", key: "humrug_ner" },
    { label: "Хөмрөгийн зэрэглэл", key: "humrug_zereglel" },
    { label: "Архивт анх баримт шилжүүлсэн огноо", key: "anhnii_ognoo" },
    { label: "Хөмрөг өөрчлөлт", key: "humrug_uurchlult" },
    { label: "Өөрчлөлт огноо", key: "uurchlult_ognoo" },
    { label: "Тайлбар", key: "tailbar" },
];
