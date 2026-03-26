import { useEffect, useState } from "react";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import AngiEdit from "./AngiEdit";
import AngiNew from "./AngiNew";

import useAuthPermission from "../../../useAuthPermission";
import Spinner from "../../../Spinner";

const index = () => {
    const [getAngi, setAngi] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]); // row clear хийж байгаа
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    const { tubshin, loading, error } = useAuthPermission();

    useEffect(() => {
        refreshAngi();
    }, []);
    useEffect(() => {
        if (getRowsSelected[0] != undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getAngi[getRowsSelected[0]]);
        }
    }, [getRowsSelected]);
    const refreshAngi = () => {
        axios
            .get("/get/angi")
            .then((res) => {
                setRowsSelected([]);
                setAngi(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Get current authenticated user's tubshin on mount
    if (loading)
        return (
            <div>
                <Spinner />
            </div>
        );
    if (error) return <p>Алдаа гарлаа</p>;

    const isRestricted = tubshin === 2;

    const btnDelete = () => {
        setRowsSelected([]);
        if (getAngi[getRowsSelected[0]].id != "") {
            Swal.fire({
                title: "Та устгахдаа итгэлтэй байна уу?",
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/angi", {
                            id: getAngi[getRowsSelected[0]].id,
                        })
                        .then((res) => {
                            Swal.fire(res.data.msg);
                            refreshAngi();
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
                        <h1 className="text-center mb-4">Анги</h1>
                        <MUIDatatable
                            data={getAngi}
                            setdata={setAngi}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#angiNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"Нэмэх"}
                                    excelDownloadData={getAngi}
                                    excelHeaders={excelHeaders}
                                    excelTitle="Анги"
                                    isHideInsert={isRestricted}
                                    isHideEdit={isRestricted}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#angiEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1}
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={isRestricted}
                            isHideEdit={isRestricted}
                        />
                        <AngiNew refreshAngi={refreshAngi} />
                        <AngiEdit
                            setRowsSelected={setRowsSelected}
                            refreshAngi={refreshAngi}
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
        name: "idangi",
        label: "Ангийн дугаар",
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
        label: "Анги нэр",
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
    { label: "Командлалын нэр", key: "name" },
    { label: "Ангийн дугаар", key: "idangi" },
    { label: "Ангийн нэр", key: "ner" },
];
