import { useEffect, useState } from "react";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import ComandlalEdit from "./ComandlalEdit";
import ComandlalNew from "./ComandlalNew";

const index = () => {
    const [getComandlal, setComandlal] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]); // row clear хийж байгаа
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    useEffect(() => {
        refreshComandlal();
    }, []);
    useEffect(() => {
        if (getRowsSelected[0] != undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getComandlal[getRowsSelected[0]]);
        }
    }, [getRowsSelected]);
    const refreshComandlal = () => {
        axios
            .get("/get/comandlal")
            .then((res) => {
                setRowsSelected([]);
                setComandlal(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const btnDelete = () => {
        setRowsSelected([]);
        if (getComandlal[getRowsSelected[0]].id != "") {
            Swal.fire({
                title: "Та устгахдаа итгэлтэй байна уу?",
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/comandlal", {
                            id: getComandlal[getRowsSelected[0]].id,
                        })
                        .then((res) => {
                            Swal.fire(res.data.msg);
                            refreshComandlal();
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
        setIsEditBtnClick(true);
    };

    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">Командлал</h1>
                        <MUIDatatable
                            data={getComandlal}
                            setdata={setComandlal}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#comandlalNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"НЭМЭХ"}
                                    excelDownloadData={getComandlal}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#comandlalEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1}
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />
                        <ComandlalNew refreshComandlal={refreshComandlal} />
                        <ComandlalEdit
                            setRowsSelected={setRowsSelected}
                            refreshComandlal={refreshComandlal}
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
        name: "name",
        label: "Нэр",
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
        name: "ShortName",
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
];

const excelHeaders = [
    { label: "Нэр", key: "hereglegch_ner" },
    { label: "Товч нэр", key: "ShortName" },
];
