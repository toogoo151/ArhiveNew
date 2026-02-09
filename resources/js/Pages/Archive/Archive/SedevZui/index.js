import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import SedevEdit from "./SedevEdit";
import SedevNew from "./SedevNew";
const Index = () => {

    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);

    // ================= DATA =================
    const [allSedevzui, setallSedevzui] = useState([]);
    const [getSedevzui, setSedevzui] = useState([]);
    const [getHumrug, setHumrug] = useState([]);
    const [getDans, setDans] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [editRequestId, setEditRequestId] = useState(0);

    // Don't let Bootstrap auto-open the edit modal before React fills the form.
    // We'll open it programmatically inside `TovchlolEdit`.
    const [showModal] = useState(null);

    // FETCH
    useEffect(() => {
        refreshSedevzui();
        axios
            .get("/get/Humrug")
            .then((res) => {
                setHumrug(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get("/get/Dans")
            .then((res) => {
                setDans(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const refreshSedevzui = () => {
        axios
            .get("/get/sedevzuils")
            .then((res) => {
                setRowsSelected([]);
                setallSedevzui(res.data);
                setSedevzui(res.data); // анх бүх өгөгдөл
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
            setclickedRowData(getSedevzui[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getSedevzui]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setSedevzui(allSedevzui);
            return;
        }

    }, [isFilterActive,  allSedevzui]);

    const btnEdit = () => {
          // Ensure the edit modal gets the selected row immediately on first click
          if (getRowsSelected[0] !== undefined) {
            setclickedRowData(getSedevzui[getRowsSelected[0]]);
        }
        setIsEditBtnClick(true);
        // Trigger edit modal open every click
        setEditRequestId((prev) => prev + 1);
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
                    .post("/delete/sedevzui", {
                        id: getSedevzui[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshSedevzui();
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
        label: " ",
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
        name: "humrug_id",
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
            customBodyRenderLite: (dataIndex) => {
                const rowData = getSedevzui[dataIndex];
                if (!rowData || !rowData.humrug_id) return "-";
                const humrug = getHumrug.find((el) => el.id == rowData.humrug_id);
                return humrug?.humrug_dugaar || "-";
            },
        },
    },
    {
        name: "humrug_ner",
        label: "Хөмрөгийн нэр",
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
            customBodyRenderLite: (dataIndex) => {
                const rowData = getSedevzui[dataIndex];
                if (!rowData || !rowData.humrug_id) return "-";
                const humrug = getHumrug.find((el) => el.id == rowData.humrug_id);
                return humrug?.humrug_ner || "-";
            },
        },
    },
    {
        name: "dans_id",
        label: "Дансны дугаар",
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
            customBodyRenderLite: (dataIndex) => {
                const rowData = getSedevzui[dataIndex];
                if (!rowData || !rowData.dans_id) return "-";
                const dans = getDans.find((el) => el.id == rowData.dans_id);
                return dans?.dans_dugaar || "-";
            },
        },
    },
    {
        name: "dans_ner",
        label: "Дансны нэр",
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
            customBodyRenderLite: (dataIndex) => {
                const rowData = getSedevzui[dataIndex];
                if (!rowData || !rowData.dans_id) return "-";
                const dans = getDans.find((el) => el.id == rowData.dans_id);
                return dans?.dans_ner || "-";
            },
        },
    },
    {
        name: "zaagch_tobchlol",
        label: "Сэдэв зүй заагчийн - Товчлол",
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
        name: "zaagch_tailal",
        label: "Сэдэв зүй заагчийн - Тайлал",
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
        // Checking
    console.log(getDans);
    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">Сэдэв зүйн заагч </h1>

                        {/* TABLE */}
                        <MUIDatatable
                            data={getSedevzui}
                            setdata={setSedevzui}
                            columns={columns}
                            sortOrder={{ name: "id", direction: "desc" }}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#SedevNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelDownloadData={getSedevzui}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#SedevEdit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />

                        <SedevNew refreshSedevzui={refreshSedevzui} />
                        <SedevEdit
                            setRowsSelected={setRowsSelected}
                            refreshSedevzui={refreshSedevzui}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                            editRequestId={editRequestId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;

const excelHeaders = [
    { label: "id", key: "id" },
    { label: "Хөмрөгийн дугаар", key: "humrug_id" },
    { label: "Дансны дугаар", key: "dans_id" },
    { label: "Товчлол", key: "zaagch_tobchlol" },
    { label: "Тайлал", key: "zaagch_tailal" },
];
