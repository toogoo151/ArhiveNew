import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import DalanJilhunChildEdit from "./DalanJilSanhuuChildEdit";
import DalanJilhunChildNew from "./DalanJilSanhuuChildNew";

const DalanJilSanhuuChild = (props) => {
    const [getdalansanhuuChild, setdalansanhuuChild] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [showModal] = useState("modal");

    // useEffect(() => {
    //     refreshdalanSanhuuChild(props.changeDataRow.id);
    // }, []);

    useEffect(() => {
        // Parent мөр өөрчлөгдөх үед child table refresh хийнэ
        refreshdalanSanhuuChild(props.changeDataRow.id);

        // 🔥 Edit mode болон сонгогдсон row-ийг reset хийнэ
        setclickedRowData([]);
        setRowsSelected([]);
        setIsEditBtnClick(false);
    }, [props.changeDataRow.id]);

    const btnEdit = () => {
        if (!getRowsSelected.length) {
            Swal.fire("Засах мөр сонгоно уу!");
            return;
        }

        const rowIndex = getRowsSelected[0];
        const rowData = getdalansanhuuChild[rowIndex];

        setclickedRowData(rowData); // 🔥 ЭНД өгөгдөл дамжуулна
        setIsEditBtnClick(true);
    };
    const { changeDataRow } = props;

    // const deleteOldFile = (file) => {
    //     Swal.fire({
    //         title: "Устгах уу?",
    //         text: `"${file.filename}" файлыг устгах гэж байна`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Тийм, устга",
    //         cancelButtonText: "Болих",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             axios
    //                 .post("/delete/baingaIltChildFile", {
    //                     id: props.changeDataRow.id,
    //                     file_url: file.url,
    //                 })
    //                 .then((res) => {
    //                     Swal.fire(res.data.msg);

    //                     //  UI дээрээс устгасан файлыг хасна
    //                     const filtered = oldFiles.filter(
    //                         (f) => f.url !== file.url
    //                     );
    //                     setOldFiles(filtered);
    //                 })
    //                 .catch((err) => {
    //                     Swal.fire(
    //                         err.response?.data?.msg || "Устгах үед алдаа гарлаа"
    //                     );
    //                 });
    //         }
    //     });
    // };
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
                    .post("/delete/DalanJilsanhuuChild", {
                        id: getdalansanhuuChild[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);

                        // 🔥 selection цэвэрлэнэ
                        setRowsSelected([]);

                        // 🔥 дахин татна
                        refreshdalanSanhuuChild(props.changeDataRow.id);
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };
    const refreshdalanSanhuuChild = (id) => {
        axios
            .post("get/DalanJilsanhuuChild", {
                _parentID: id,
            })
            .then((res) => {
                // console.log(res.data);
                setdalansanhuuChild(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,

        filename: "Чиглэл",
        button: {
            excel: true,
            print: true,
        },
        language: {
            length_menu: "Эхний _MENU_ мөрийг харж байна.",
            filter: "Хайх ...",
            info: "Эхний _START_ ээс _END_ өгөгдөл харж байна. Нийт _TOTAL_ өгөгдөл байна.",
            no_data_text: "Өгөгдөл олдсонгүй.",
            pagination: {
                first: "Эхний",
                previous: "Өмнөх",
                next: "Дараагийн",
                last: "Сүүлийн",
            },
        },
    };
    const handleChangeNew = (event, data, rowIndex) => {
        setChangeDataRow(data);
        setGetDataRowLenght(rowIndex);
    };

    //     {
    //         text: "№",
    //         key: "id",
    //         cell: (row, index) => {
    //             if (index === 0) {
    //                 if (changeDataRow.id === row.id && getDataRowLenght > -1) {
    //                     return (
    //                         <div className="bg-success position-static mt-2 rounded text-center p-1 pointer-on-hover">
    //                             <span hidden={true}>{parseInt(index) + 1}</span>
    //                             <i className="fa fa-check text-white"></i>
    //                         </div>
    //                     );
    //                 }
    //                 return (
    //                     <div className="text-center pointer-on-hover">
    //                         {parseInt(index) + 1}
    //                     </div>
    //                 );
    //             } else {
    //                 if (changeDataRow.id === row.id && getDataRowLenght > -1) {
    //                     return (
    //                         <div className="bg-success position-static mt-2 rounded text-center p-1 pointer-on-hover">
    //                             <span hidden={true}>{parseInt(index) + 1}</span>
    //                             <i className="fa fa-check text-white"></i>
    //                         </div>
    //                     );
    //                 }
    //                 return (
    //                     <div className="text-center pointer-on-hover">
    //                         {parseInt(index) + 1}
    //                     </div>
    //                 );
    //             }
    //         },
    //         align: "center",
    //         sortable: true,
    //         className: "small-column-id",
    //     },

    //     {
    //         text: "Нэр",
    //         key: "way_child",
    //         align: "center",
    //         sortable: true,
    //     },
    //     {
    //         text: "Төлөв",
    //         key: "status",
    //         cell: (row) => {
    //             if (row.status === 1) {
    //                 return "Харуулсан";
    //             } else {
    //                 return "Нуусан";
    //             }
    //         },

    //         align: "center",
    //         sortable: true,
    //     },
    // ];
    return (
        <>
            <div className="row clearfix">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">БАРИМТ БИЧИГ</h1>
                        <MUIDatatable
                            data={getdalansanhuuChild}
                            setdata={setdalansanhuuChild}
                            columns={columns}
                            onRowClick={(rowData, rowMeta) => {
                                const selectedRow =
                                    getdalansanhuuChild[rowMeta.dataIndex];
                                setclickedRowData(selectedRow); // 🔥 ЭНД гол set
                            }}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#dalanSanhuuNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"НЭМЭХ"}
                                    excelDownloadData={getdalansanhuuChild}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#dalanSanhuuChildEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1}
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                            showArchive={false}
                        />
                        <DalanJilhunChildNew
                            _parentID={props.changeDataRow.id}
                            refreshdalanSanhuuChild={refreshdalanSanhuuChild}
                        />
                        <DalanJilhunChildEdit
                            setRowsSelected={setRowsSelected}
                            refreshdalanSanhuuChild={refreshdalanSanhuuChild}
                            changeDataRow={clickedRowData}
                            parentID={props.changeDataRow.id}
                            isEditBtnClick={isEditBtnClick}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DalanJilSanhuuChild;
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
        name: "barimt_ner",
        label: "Баримт бичгийн нэр",
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
        name: "barimt_ognoo",
        label: "Баримтын бичгийн огноо",
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
        name: "barimt_dugaar",
        label: "Баримт бичгийн дугаар",
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
        name: "irsen_dugaar",
        label: "Ирсэн бичгийн дугаар",
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
        name: "yabsan_dugaar",
        label: "Явсан бичгийн дугаар",
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
        name: "uild_gazar",
        label: "Үйлдсэн газар",
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
        name: "huudas_too",
        label: "Хуудас тоо",
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
        name: "habsralt_too",
        label: "Хавсралт тоо",
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
        name: "huudas_dugaar",
        label: "Хуудас дугаар",
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
        name: "aguulga",
        label: "Агуулга",
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
        name: "file_ner",
        label: "Хавсралт файл",
        options: {
            filter: false,
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
                if (!value) return "-";

                // ;-ээр салгана
                const files = value.split(";").filter((f) => f.trim() !== "");

                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                        }}
                    >
                        {files.map((fileUrl, index) => {
                            const fileName = fileUrl.split("/").pop();

                            return (
                                <a
                                    key={index}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={fileName}
                                    className="btn btn-sm btn-danger d-flex align-items-center"
                                    style={{
                                        padding: "4px 8px",
                                        width: "fit-content",
                                    }}
                                >
                                    <i className="fas fa-file-pdf mr-2"></i>
                                    <span style={{ fontSize: "12px" }}>
                                        {fileName}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                );
            },
        },
    },
    {
        name: "bichsen_ner",
        label: "Баримт бүртгэсэн ажилтан",
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
        name: "bichsen_ognoo",
        label: "Баримт бүртгэсэн огноо",
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
    { label: "Баримт бичгийн нэр", key: "barimt_ner" },
    { label: "Баримтын бичгийн огноо", key: "barimt_ognoo" },
    { label: "Баримт бичгийн дугаар", key: "barimt_dugaar" },
    { label: "Ирсэн бичгийн дугаар", key: "irsen_dugaar" },
    { label: "Явсан бичгийн дугаар ", key: "yabsan_dugaar" },
    { label: "Үйлдсэн газар", key: "uild_gazar" },
    { label: "Хуудас тоо", key: "huudas_too" },
    { label: "Хавсралт тоо", key: "habsralt_too" },
    { label: "Хуудас дугаар", key: "huudas_dugaar" },
    {
        label: "Агуулга",
        key: "aguulga",
    },
    { label: "Баримт бүртгэсэн ажилтан", key: "bichsen_ner" },
    { label: "Баримт бүртгэсэн огноо", key: "bichsen_ognoo" },
];
