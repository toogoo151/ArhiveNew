import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import NomEdit from "./NomEdit";
import NomNew from "./NomNew";
const Index = () => {

    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);

    // ================= DATA =================
    const [allNom, setallNom] = useState([]);
    const [getNom, setNom] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [editRequestId, setEditRequestId] = useState(0);

    // Don't let Bootstrap auto-open the edit modal before React fills the form.
    // We'll open it programmatically inside `NomEdit`.
    const [showModal] = useState(null);

    // FETCH
    useEffect(() => {
        refreshNom();
    }, []);

    const refreshNom = () => {
        axios
            .get("/get/ashignoms")
            .then((res) => {
                setRowsSelected([]);
                setallNom(res.data);
                setNom  (res.data); // анх бүх өгөгдөл
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
            setclickedRowData(getNom[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getNom]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setNom(allNom);
            return;
        }

    }, [isFilterActive,  allNom]);
    const btnEdit = () => {
        // Ensure the edit modal gets the selected row immediately on first click
        if (getRowsSelected[0] !== undefined) {
            setclickedRowData(getNom[getRowsSelected[0]]);
        }
        setIsEditBtnClick(true);
        // Trigger edit modal open every click (even if already edited once)
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
                    .post("/delete/ashignom", {
                        id: getNom[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshNom();
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
        },
    },
    {
        name: "dans_dugaar",
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
        },
    },
    {
        name: "nom_dugaar",
        label: "Номын дугаар",
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
        name: "nom_ners",
        label: "Номын нэр",
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

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">Ашигласан номын жагсаалт 11111 </h1>

                        {/* TABLE */}
                        <MUIDatatable
                            data={getNom}
                            setdata={setNom}
                            sortOrder={{ name: "id", direction: "desc" }}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#NomNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelDownloadData={getNom}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#NomEdit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />

                        <NomNew refreshNom={refreshNom} />
                        <NomEdit
                            setRowsSelected={setRowsSelected}
                            refreshNom={refreshNom}
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
    { label: "Хөмрөгийн дугаар", key: "humrug_dugaar" },
    { label: "Дансны дугаар", key: "dans_dugaar" },
    { label: "Номын дугаар", key: "nom_dugaar" },
    { label: "Номын нэр", key: "nom_ners" },
];
