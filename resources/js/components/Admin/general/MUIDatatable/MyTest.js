import React, { useState, useEffect } from "react";
import MUIDatatable from "./MUIDatatable";
import axios from "../../../../AxiosUser";
import CustomToolbar from "./CustomToolbar";
import New from "./New";
const MyTest = () => {
    const [users, setUsers] = useState([]);
    const [getRowSelected, setRowSelected] = useState([]);
    useEffect(() => {
        refreshUsers();
    }, []);
    useEffect(() => {
        console.log(getRowSelected);
    }, [getRowSelected]);
    const refreshUsers = () => {
        axios
            .get("/get/all/amdins")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const btnInsert = () => {
        console.log("darlaa 123");
    };
    const btnDelete = (e) => {
        console.log(e.data[0].index);
        console.log(users[e.data[0].index]);
    };
    const btnEdit = (e) => {
        console.log("edit darlaa");
        console.log(e.data[0].index);
        console.log("edit darlaa");
    };
    return (
        <div>
            <MUIDatatable
                data={users}
                columns={columns}
                costumToolbar={
                    <>
                        <CustomToolbar
                            btnClassName={"btn btn-success"}
                            modelType={"modal"}
                            dataTargetID={"#adminNew"}
                            spanIconClassName={"fas fa-solid fa-plus"}
                            buttonName={"НЭМЭХ"}
                            btnInsert={btnInsert}
                            excelDownloadData={users}
                            excelHeaders={excelHeaders}
                        />
                    </>
                }
                btnEdit={btnEdit}
                editbtnClassName={"btn btn-warning"}
                editmodelType={"modal"}
                editdataTargetID={"#adminEdit"}
                editspanIconClassName={"fas fa-solid fa-edit"}
                editbuttonName={"ЗАСАХ"}
                btnDelete={btnDelete}
                setRowSelected={setRowSelected} // click хийсэн row ийн index авч байгаа
                avgColumnIndex={2} // -1 байвал дундаж бодохгүй. дундаж бодох column index оруул. index нь 0 ээс эхлэж байгаа
                avgColumnName={"email"} //
                avgName={"Дундаж: "}
            />

            <New />
        </div>
    );
};

export default MyTest;
const columns = [
    {
        name: "id",
        label: "№",
        options: {
            filter: true,
            sort: true,
            // display: false,
            // viewColumns: false,
            filter: false,
            customBodyRenderLite: (rowIndex) => {
                if (rowIndex == 0) {
                    return rowIndex + 1;
                } else {
                    return rowIndex + 1;
                }
            },
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
        name: "phone",
        label: "Утас",
        options: {
            filter: true,
            sort: true,
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
        name: "email",
        label: "email",
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
        name: "firstName",
        label: "firstName",
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
        name: "position",
        label: "position",
        options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <a href="123">
                        <button className="btn btn-success">{value}</button>
                    </a>
                );
            },
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
    { label: "First Name", key: "id" },
    { label: "Last Name", key: "phone" },
    { label: "Email", key: "email" },
    { label: "firstName", key: "firstName" },
    { label: "position", key: "position" },
];
