import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import axios from "../../../AxiosUser";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
const TurHadgalahHugatsaa = ({}) => {
    // 🔥 MODAL НЭЭГДЭХ ҮЕД ШАЛГАХ
    // ===============================

    const formSchema = Yup.object().shape({});
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
        setValue,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema),
    });
    const [getJagsaalt, setJagsaalt] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    useEffect(() => {
        if (getRowsSelected[0] !== undefined) {
            setclickedRowData(getJagsaalt[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getJagsaalt]);

    useEffect(() => {
        refreshJagsaalt();
    }, []);

    const refreshJagsaalt = () => {
        axios
            .get("/get/jagsaalt")
            .then((res) => {
                setRowsSelected([]);
                setJagsaalt(res.data); // анх бүх өгөгдөл
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <div className="modal" id="HadHugatsaa">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                {" "}
                                Хадгалах хугацааны жагсаалтын зүйлийн дугаар{" "}
                            </h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>

                        <div
                            className="modal-body"
                            style={{
                                maxHeight: "70vh",
                                overflowY: "auto",
                                padding: "10px",
                            }}
                        >
                            {" "}
                            <MUIDatatable
                                data={getJagsaalt}
                                setdata={setJagsaalt}
                                columns={columns}
                                getRowsSelected={getRowsSelected}
                                setRowsSelected={setRowsSelected}
                                isHideDelete={false}
                                isHideEdit={false}
                                options={{
                                    responsive: "standard",
                                    selectableRows: "single",
                                    rowsPerPage: 10,
                                    rowsPerPageOptions: [10, 20, 50],
                                    download: false,
                                    print: false,
                                    viewColumns: false,
                                    filter: true,
                                    search: true,
                                    fixedHeader: true,
                                    tableBodyHeight: "50vh",
                                }}
                            />
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                            >
                                Хаах
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TurHadgalahHugatsaa;
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
        name: "jName",
        label: "Жагсаалтын төрөл",
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
        name: "barimt_turul",
        label: "Баримт төрөл",
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
        name: "barimt_dedturul",
        label: "Баримтын дэд төрөл",
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
        name: "barimt_dd",
        label: "Дэс дугаар",
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
        name: "barimt_ner",
        label: "Баримтын нэр",
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
        name: "RetName",
        label: "Хадгалах хугацааны төрөл",
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
        name: "hugatsaa",
        label: "Хадгалах хугацаа",
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
        name: "tailbar",
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
    {
        name: "tobchlol",
        label: "Товчлол",
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
