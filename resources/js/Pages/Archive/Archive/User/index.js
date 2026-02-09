import { useEffect, useState } from "react";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import UserEdit from "./UserEdit";
import UserNew from "./UserNew";

import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

const index = () => {
    const [getUser, setUser] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]); // row clear хийж байгаа
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    useEffect(() => {
        refreshUser();
    }, []);
    useEffect(() => {
        if (getRowsSelected[0] != undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getUser[getRowsSelected[0]]);
        }
    }, [getRowsSelected]);
    const refreshUser = () => {
        axios
            .get("/get/user")
            .then((res) => {
                setRowsSelected([]);
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const btnDelete = () => {
        setRowsSelected([]);
        if (getUser[getRowsSelected[0]].id != "") {
            Swal.fire({
                title: "Та устгахдаа итгэлтэй байна уу?",
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/user", {
                            id: getUser[getRowsSelected[0]].id,
                        })
                        .then((res) => {
                            Swal.fire(res.data.msg);
                            refreshUser();
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
                        <h1 className="text-center">Хэрэглэгчид</h1>
                        <MUIDatatable
                            data={getUser}
                            setdata={setUser}
                            columns={columns}
                            costumToolbar={
                                <>
                                    <CustomToolbar
                                        // title={"Хэрэглэгчид"}
                                        btnClassName={"btn btn-success"}
                                        modelType={"modal"}
                                        dataTargetID={"#userNew"}
                                        spanIconClassName={
                                            "fas fa-solid fa-plus"
                                        }
                                        buttonName={"НЭМЭХ"}
                                        excelDownloadData={getUser}
                                        excelHeaders={excelHeaders}
                                        isHideInsert={true}
                                    />
                                </>
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#userEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1} // -1 байвал дундаж бодохгүй. дундаж бодох column index оруул. index нь 0 ээс эхлэж байгаа
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />
                        <UserNew refreshUser={refreshUser} />
                        <UserEdit
                            setRowsSelected={setRowsSelected}
                            refreshUser={refreshUser}
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
        name: "hereglegch_ner",
        label: "Хэрэглэгч нэр",
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
        name: "Pname",
        label: "Программын төрөл",
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
        name: "Uname",
        label: "Хэрэглэгчийн түвшин",
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
        name: "Nname",
        label: "Нууцын төрөл",
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
    { label: "Хэрэглэгчийн нэр", key: "hereglegch_ner" },
    { label: "Командлал", key: "ShortName" },
    { label: "Анги", key: "ner" },
    { label: "Салбар", key: "salbar" },
    { label: "Программын төрөл", key: "Pname" },
    { label: "Хэрэглэгчийн түвшин", key: "Uname" },
    { label: "Нууцын төрөл", key: "Nname" },
];
