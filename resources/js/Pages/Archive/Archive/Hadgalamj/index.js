import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

// import HutheregEdit from "./HutheregEdit";
// import HutheregNew from "./HutheregNew";

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
    const [allHuthereg, setAllHuthereg] = useState([]);
    const [getHuthereg, setHuthereg] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    // ================= FETCH =================
    useEffect(() => {
        refreshHadgalamj();
    }, []);

    const refreshHadgalamj = () => {
        axios
            .get("/get/Huthereg")
            .then((res) => {
                setRowsSelected([]);
                setAllHuthereg(res.data);
                setHuthereg(res.data); // анх бүх өгөгдөл
                setIsFilterActive(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // ================= ROW SELECT =================
    useEffect(() => {
        if (getRowsSelected[0] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getHuthereg[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getHuthereg]);

    // ================= DATE FILTER =================
    useEffect(() => {
        if (!isFilterActive) {
            setHuthereg(allHuthereg);
            return;
        }

        if (!getStartDate || !getEndDate) return;

        const start = new Date(getStartDate);
        const end = new Date(getEndDate);

        const filtered = allHuthereg.filter((item) => {
            if (!item.ognoo) return false;
            const itemDate = new Date(item.ognoo);
            return itemDate >= start && itemDate <= end;
        });

        setHuthereg(filtered);
    }, [isFilterActive, getStartDate, getEndDate, allHuthereg]);

    // ================= ACTIONS =================
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
                    .post("/delete/huthereg", {
                        id: getHuthereg[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshHadgalamj();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    // ================= RENDER =================
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">Хөтлөх хэргийн жагсаалт</h1>

                        {/* DATE FILTER */}
                        <div className="col-md-8 mb-3">
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

                                {/* SEARCH */}
                                <button
                                    className="btn btn-primary ms-2"
                                    onClick={() => setIsFilterActive(true)}
                                >
                                    Хайх
                                </button>

                                {/* CLEAR */}
                                <button
                                    className="btn btn-secondary ms-2"
                                    onClick={() => {
                                        setIsFilterActive(false);
                                        setStartDate(defaultStart);
                                        setEndDate(defaultEnd);
                                        setHuthereg(allHuthereg);
                                    }}
                                >
                                    Цэвэрлэх
                                </button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <MUIDatatable
                            data={getHuthereg}
                            setdata={setHuthereg}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#hutheregNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="НЭМЭХ"
                                    excelDownloadData={getHuthereg}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#hutheregEdit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />

                        {/* <HutheregNew refreshHadgalamj={refreshHadgalamj} />
                        <HutheregEdit
                            setRowsSelected={setRowsSelected}
                            refreshHadgalamj={refreshHadgalamj}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        /> */}
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
        name: "ognoo",
        label: "Он",
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
        name: "des_dugaar",
        label: "Дэс дугаар",
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
        name: "indeks",
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
        name: "garchig",
        label: "Хэргийн агуулга, гарчиг",
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
        name: "hugatsaa",
        label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар, хадгалах хугацаа",
        options: {
            filter: true,
            sort: false,
            setCellHeaderProps: () => ({
                style: {
                    backgroundColor: "#5DADE2",
                    color: "white",
                    whiteSpace: "normal", // ⭐ мөр хугална
                    textAlign: "center",
                },
            }),
        },
    },
    {
        name: "alban_tushaal",
        label: "Хариуцах албан тушаалтан",
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
        name: "tailbar",
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
    { label: "Он", key: "ognoo" },
    { label: "Дэс дугаар", key: "des_dugaar" },
    { label: "Хэргийн индекс", key: "indeks" },
    { label: "Хэргийн агуулга, гарчиг", key: "garchig" },
    { label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар", key: "hugatsaa" },
    { label: "Хариуцах албан тушаалтан", key: "alban_tushaal" },
    { label: "Тайлбар", key: "tailbar" },
];
