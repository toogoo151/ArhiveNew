import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import BaingaIltsChildEdit from "./BaingaIltsChildEdit";
import BaingaIltsChildNew from "./BaingaIltsChildNew";
import "./Index.css";

import Spinner from "../../../Spinner";
import useAuthPermission from "../../../useAuthPermission";

const BaingaIltsChild = (props) => {
    const [getbaingaIltsChild, setbaingaIltsChild] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const [showModal] = useState("modal");

    const { tubshin, loading, error } = useAuthPermission();

    // useEffect(() => {
    //     refreshbaingaIltsChild(props.changeDataRow.id);
    // }, []);

    const refreshbaingaIltsChild = (id) => {
        axios
            .post("get/baingaIltsChild", {
                _parentID: id,
            })
            .then((res) => {
                // console.log(res.data);
                setbaingaIltsChild(res.data.data);
                setTotalRows(res.data.total || 0);
                setTotalRows(0);
            })
            .catch((err) => {
                console.log(err);
                setbaingaIltsChild([]); //
                setTotalRows(0);
            });
    };

    useEffect(() => {
        // Parent мөр өөрчлөгдөх үед child table refresh хийнэ
        refreshbaingaIltsChild(props.changeDataRow.id);

        // 🔥 Edit mode болон сонгогдсон row-ийг reset хийнэ
        setclickedRowData([]);
        setRowsSelected([]);
        0;
        setIsEditBtnClick(false);
        0;
    }, [props.changeDataRow]);

    const btnEdit = () => {
        if (!getRowsSelected.length) {
            Swal.fire("Засах мөр сонгоно уу!");
            return;
        }

        const rowIndex = getRowsSelected[0];
        const rowData = getbaingaIltsChild[rowIndex];

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
                    .post("/delete/baingaIltChild", {
                        id: getbaingaIltsChild[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);

                        // 🔥 selection цэвэрлэнэ
                        setRowsSelected([]);

                        // 🔥 дахин татна
                        refreshbaingaIltsChild(props.changeDataRow.id);
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    const importExcel = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("hnID", props.changeDataRow.id);

        axios
            .post("/import/BaingaIltsChild", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshbaingaIltsChild(props.changeDataRow.id);
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
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

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        responsive: "standard",
        tableBodyHeight: "500px",
        tableBodyMaxHeight: "700px",

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
            {/* <div className="col-md-12 mb-3">
                    <label htmlFor="bainagiltChildExcel" className="form-label">
                        Excel Import
                    </label>
                    <div className="d-flex align-items-center">

                        <input
                            type="file"
                            id="bainagiltChildExcel"
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
                                    importExcel(selectedFile);
                                    setSelectedFile(null);
                                    document.getElementById(
                                        "bainagiltChildExcel"
                                    ).value = null;
                                }}
                            >
                                Import
                            </button>
                        )}
                    </div>
                </div> */}
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
                            id="BainIltsExcel"
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
                                            "BainIltsExcel"
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
                        data={getbaingaIltsChild}
                        setdata={setbaingaIltsChild}
                        columns={columns}
                        isServerSide={true}
                        count={totalRows}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setPage={setPage}
                        setRowsPerPage={setRowsPerPage}
                        onRowClick={(rowData, rowMeta) => {
                            const selectedRow =
                                getbaingaIltsChild[rowMeta.dataIndex];
                            setclickedRowData(selectedRow); // 🔥 ЭНД гол set
                        }}
                        costumToolbar={
                            <CustomToolbar
                                btnClassName={"btn btn-success"}
                                modelType={"modal"}
                                dataTargetID={"#baingaIltsChildNew"}
                                spanIconClassName={"fas fa-solid fa-plus"}
                                buttonName={"Нэмэх"}
                                excelDownloadData={getbaingaIltsChild}
                                excelHeaders={excelHeaders}
                                isHideInsert={true}
                            />
                        }
                        btnEdit={btnEdit}
                        modelType={showModal}
                        editdataTargetID={"#baingaIltsChildEdit"}
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
                    <BaingaIltsChildNew
                        _parentID={props.changeDataRow.id}
                        refreshbaingaIltsChild={refreshbaingaIltsChild}
                    />
                    <BaingaIltsChildEdit
                        setRowsSelected={setRowsSelected}
                        refreshbaingaIltsChild={refreshbaingaIltsChild}
                        changeDataRow={clickedRowData}
                        parentID={props.changeDataRow.id}
                        isEditBtnClick={isEditBtnClick}
                    />
                </div>
            </div>
        </>
    );
};

export default BaingaIltsChild;
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
