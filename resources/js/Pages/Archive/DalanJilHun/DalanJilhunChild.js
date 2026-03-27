import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import DalanJilhunChildEdit from "./DalanJilhunChildEdit";
import DalanJilhunChildNew from "./DalanJilhunChildNew";
import "./Index.css";

import useAuthPermission from "../../../useAuthPermission";
import Spinner from "../../../Spinner";

const DalanJilhunChild = (props) => {
    const [getdalanhunChild, setdalanhunChild] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const [showModal] = useState("modal");

    const { tubshin, loading, error } = useAuthPermission();

    // useEffect(() => {
    //     refreshdalanHunChild(props.changeDataRow.id);
    // }, []);

    useEffect(() => {
        // Parent мөр өөрчлөгдөх үед child table refresh хийнэ
        refreshdalanHunChild(props.changeDataRow.id);

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
        const rowData = getdalanhunChild[rowIndex];

        setclickedRowData(rowData); // 🔥 ЭНД өгөгдөл дамжуулна
        setIsEditBtnClick(true);
    };
    const { changeDataRow } = props;

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
        if (!getRowsSelected.length) return;

        Swal.fire({
            title: "Та устгахдаа итгэлтэй байна уу?",
            showCancelButton: true,
            confirmButtonText: "Тийм",
            cancelButtonText: "Үгүй",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post("/delete/DalanJilhunChild", {
                        id: getdalanhunChild[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);

                        // 🔥 selection цэвэрлэнэ
                        setRowsSelected([]);

                        // 🔥 дахин татна
                        refreshdalanHunChild(props.changeDataRow.id);
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };
    const handlePreview = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1, // array хэлбэрээр авна
            });

            setPreviewData(jsonData);
            setShowPreviewModal(true);
        };

        reader.readAsArrayBuffer(file);
    };

    const importExcel = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        axios
            .post("/import/DalanJilChild", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshdalanHunChild(props.changeDataRow.id);
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };
    const refreshdalanHunChild = (id) => {
        axios
            .post("get/DalanJilhunChild", {
                _parentID: id,
            })
            .then((res) => {
                // console.log(res.data);
                setdalanhunChild(res.data);
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
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden", // 🔥 чухал (table тасрахгүй)
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        padding: "14px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e2e8f0",
                        background: "#f8fafc",
                    }}
                >
                    {/* LEFT */}
                    <div style={{ display: "flex", gap: "30px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                            <span style={{ color: "#64748b" }}>📁 Дугаар:</span>
                            <span style={{ fontWeight: 600 }}>
                                {changeDataRow?.hadgalamj_dugaar || "-"}
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                            <span style={{ color: "#64748b" }}>🏷 Гарчиг:</span>
                            <span style={{ fontWeight: 600 }}>
                                {changeDataRow?.hadgalamj_garchig || "-"}
                            </span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ color: "#64748b" }}>📊 Excel:</span>

                        <input
                            type="file"
                            id="DalaJilhunChildExcel"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => {
                                if (e.target.files.length) {
                                    setSelectedFile(e.target.files[0]);
                                }
                            }}
                        />

                        {selectedFile && (
                            <>
                                <button
                                    className="btn-preview"
                                    onClick={() => handlePreview(selectedFile)}
                                >
                                    👁
                                </button>

                                <button
                                    className="btn-import"
                                    onClick={() => {
                                        importExcel(selectedFile);
                                        setSelectedFile(null);
                                        document.getElementById(
                                            "DalaJilhunChildExcel"
                                        ).value = null;
                                    }}
                                >
                                    ⬆ Import
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {showPreviewModal && (
                    <div
                        className="modal fade show d-block"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">
                                        📊 Excel урьдчилж харах
                                    </h5>

                                    <button
                                        className="btn btn-sm btn-light"
                                        onClick={() =>
                                            setShowPreviewModal(false)
                                        }
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="px-3 py-2 border-bottom bg-light d-flex gap-3 flex-wrap">
                                    <span className="badge bg-primary fs-6">
                                        📁 Дугаар::{" "}
                                        {changeDataRow?.hadgalamj_dugaar || "-"}
                                    </span>

                                    <span className="badge bg-success fs-6">
                                        📂 Гарчиг:{" "}
                                        {changeDataRow?.hadgalamj_garchig ||
                                            "-"}
                                    </span>
                                </div>

                                <div className="modal-body p-0">
                                    <div
                                        style={{
                                            maxHeight: "60vh",
                                            overflow: "auto",
                                        }}
                                    >
                                        <table className="table table-bordered table-hover mb-0">
                                            <thead
                                                className="table-dark"
                                                style={{
                                                    position: "sticky",
                                                    top: 0,
                                                    zIndex: 1,
                                                }}
                                            >
                                                <tr>
                                                    {excelHeaders.map(
                                                        (col, i) => (
                                                            <th
                                                                key={i}
                                                                className="text-nowrap"
                                                            >
                                                                {col.label}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {previewData
                                                    .slice(1)
                                                    .map((row, i) => (
                                                        <tr key={i}>
                                                            {excelHeaders.map(
                                                                (col, j) => (
                                                                    <td
                                                                        key={j}
                                                                        className="text-nowrap"
                                                                    >
                                                                        {row[
                                                                            j
                                                                        ] ?? ""}
                                                                    </td>
                                                                )
                                                            )}
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowPreviewModal(false)
                                        }
                                    >
                                        Хаах
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ padding: "10px" }}>
                    <MUIDatatable
                        data={getdalanhunChild}
                        setdata={setdalanhunChild}
                        columns={columns}
                        onRowClick={(rowData, rowMeta) => {
                            const selectedRow =
                                getdalanhunChild[rowMeta.dataIndex];
                            setclickedRowData(selectedRow); // 🔥 ЭНД гол set
                        }}
                        costumToolbar={
                            <CustomToolbar
                                btnClassName={"btn btn-success"}
                                modelType={"modal"}
                                dataTargetID={"#dalanHunNew"}
                                spanIconClassName={"fas fa-solid fa-plus"}
                                buttonName={"Нэмэх"}
                                excelDownloadData={getdalanhunChild}
                                excelHeaders={excelHeaders}
                                isHideInsert={true}
                            />
                        }
                        btnEdit={btnEdit}
                        modelType={showModal}
                        editdataTargetID={"#dalanHunChildEdit"}
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
                        refreshdalanHunChild={refreshdalanHunChild}
                    />
                    <DalanJilhunChildEdit
                        setRowsSelected={setRowsSelected}
                        refreshdalanHunChild={refreshdalanHunChild}
                        changeDataRow={clickedRowData}
                        parentID={props.changeDataRow.id}
                        isEditBtnClick={isEditBtnClick}
                    />
                </div>
            </div>
            {/* <div className="row clearfix">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center">БАРИМТ БИЧИГ</h1>
                        <div
                            style={{
                                background: "#f1f5f9",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                marginBottom: "16px",
                                display: "flex",
                                gap: "40px",
                                fontWeight: 600,
                            }}
                        >
                            <div>
                                📁 Дугаар:{" "}
                                <span style={{ color: "#2563eb" }}>
                                    {changeDataRow?.hadgalamj_dugaar || "-"}
                                </span>
                            </div>

                            <div>
                                🏷 Хадгаламжийн гарчиг:{" "}
                                <span style={{ color: "#2563eb" }}>
                                    {changeDataRow?.hadgalamj_garchig || "-"}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label
                                htmlFor="DalanjilHunChildExcel"
                                className="form-label"
                            >
                                Excel Import
                            </label>
                            <div className="d-flex align-items-center">
                            
                                <input
                                    type="file"
                                    id="DalanjilHunChildExcel"
                                    className="form-control form-control-sm me-2"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        if (e.target.files.length)
                                            setSelectedFile(e.target.files[0]);
                                    }}
                                />

                                {selectedFile && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            importExcel(selectedFile); // Excel импортлох функц дуудна
                                            setSelectedFile(null); // файлыг цэвэрлэх
                                            document.getElementById(
                                                "DalanjilHunChildExcel"
                                            ).value = null; // input-ыг цэвэрлэх
                                        }}
                                    >
                                        Import
                                    </button>
                                )}
                            </div>
                        </div>
                        <MUIDatatable
                            data={getdalanhunChild}
                            setdata={setdalanhunChild}
                            columns={columns}
                            onRowClick={(rowData, rowMeta) => {
                                const selectedRow =
                                    getdalanhunChild[rowMeta.dataIndex];
                                setclickedRowData(selectedRow); // 🔥 ЭНД гол set
                            }}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#dalanHunNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"Нэмэх"}
                                    excelDownloadData={getdalanhunChild}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={isRestricted}
                                    isHideEdit={isRestricted}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#dalanHunChildEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1}
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={isRestricted}
                            isHideEdit={isRestricted}
                            showArchive={false}
                        />
                        <DalanJilhunChildNew
                            _parentID={props.changeDataRow.id}
                            refreshdalanHunChild={refreshdalanHunChild}
                        />
                        <DalanJilhunChildEdit
                            setRowsSelected={setRowsSelected}
                            refreshdalanHunChild={refreshdalanHunChild}
                            changeDataRow={clickedRowData}
                            parentID={props.changeDataRow.id}
                            isEditBtnClick={isEditBtnClick}
                        />
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default DalanJilhunChild;
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
                            const fileNameFull = fileUrl.split("/").pop();
                            const fileName = fileNameFull.includes("_")
                                ? fileNameFull.split("_").slice(1).join("_")
                                : fileNameFull;

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
