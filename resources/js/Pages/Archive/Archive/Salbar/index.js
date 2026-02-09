import { useEffect, useState } from "react";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import SalbarEdit from "./SalbarEdit";
import SalbarNew from "./SalbarNew";

const index = () => {
    const [getSalbar, setSalbar] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]); // row clear хийж байгаа
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    useEffect(() => {
        refreshSalbar();
    }, []);
    useEffect(() => {
        if (getRowsSelected[0] != undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getSalbar[getRowsSelected[0]]);
        }
    }, [getRowsSelected]);
    const refreshSalbar = () => {
        axios
            .get("/get/salbar")
            .then((res) => {
                setRowsSelected([]);
                setSalbar(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const btnDelete = () => {
        setRowsSelected([]);
        if (getSalbar[getRowsSelected[0]].id != "") {
            Swal.fire({
                title: "Та устгахдаа итгэлтэй байна уу?",
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/salbar", {
                            id: getSalbar[getRowsSelected[0]].id,
                        })
                        .then((res) => {
                            Swal.fire(res.data.msg);
                            refreshSalbar();
                        })
                        .catch((err) => {
                            Swal.fire(err.response.data.msg);
                        });
                } else if (result.isDenied) {
                    // Swal.fire("Changes are not saved", "", "info");
                }
            });
        }
    };
    const btnEdit = () => {
        if (getRowsSelected.length === 0) {
            Swal.fire("Анхаар!", "Засах мөрийг сонгоно уу!", "warning");
            return;
        }
        setIsEditBtnClick(true);

        // Open modal manually if using Bootstrap modal
        const editModal = new window.bootstrap.Modal(
            document.getElementById("salbarEdit")
        );
        editModal.show();
    };

    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">Салбар</h1>
                        <MUIDatatable
                            data={getSalbar}
                            setdata={setSalbar}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#salbarNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"НЭМЭХ"}
                                    excelDownloadData={getSalbar}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            // btnEdit={btnEdit}
                            // modelType={showModal}
                            // editdataTargetID={"#salbarEdit"}
                            // btnDelete={btnDelete}
                            // avgColumnIndex={-1}
                            // avgColumnName={"email"}
                            // avgName={"Дундаж: "}
                            // getRowsSelected={getRowsSelected}
                            // setRowsSelected={setRowsSelected}
                            // isHideDelete={true}
                            // isHideEdit={true}

                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#salbarEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1}
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />
                        <SalbarNew refreshSalbar={refreshSalbar} />
                        {/* <SalbarEdit
                            setRowsSelected={setRowsSelected}
                            refreshSalbar={refreshSalbar}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        /> */}

                        <SalbarEdit
                            setRowsSelected={setRowsSelected}
                            refreshSalbar={refreshSalbar}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default index;
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
        name: "ShortName",
        label: "Командлал",
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
        name: "ner",
        label: "Анги",
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
        name: "salbar",
        label: "Салбар",
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
        name: "t_ner",
        label: "Товч нэр",
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
        name: "b_ner",
        label: "Бүтэн нэр",
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
    { label: "Анги", key: "ner" },
    { label: "Салбар", key: "salbar" },
    { label: "Товч нэр", key: "t_ner" },
    { label: "Бүтэн нэр", key: "b_ner" },
];
