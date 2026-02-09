import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable2";
import DalanJIlSanhuuPrint from "./DalanJIlSanhuuPrint";

const DalanJilSanhuuShiljuuleh = ({
    selectedHumrug,
    selectedDans,
    changeDataRow,
    getDalSanhuu,
    getRowsSelected,
    setRowsSelected,
    onClose,
    refreshDalSanhuu,
}) => {
    const [clickedRowData, setclickedRowData] = useState(
        getRowsSelected[0] !== undefined
            ? getDalSanhuu[getRowsSelected[0]]
            : null
    );
    const rowData =
        getRowsSelected.length > 0
            ? getDalSanhuu[getRowsSelected[0]]
            : getDalSanhuu[0]; // эхний мөр автоматаар
    useEffect(() => {
        if (getRowsSelected.length > 0) {
            const selectedData = getRowsSelected.map(
                (rowIndex) => getDalSanhuu[rowIndex]
            );
            setclickedRowData(selectedData); // ✅ array
        } else {
            setclickedRowData(null);
        }
    }, [getRowsSelected, getDalSanhuu]);

    useEffect(() => {
        if (getRowsSelected.length > 0) {
            const rows = getRowsSelected.map(
                (rowIndex) => getDalSanhuu[rowIndex]
            );
            setSelectedRowsData(rows);
        } else {
            setSelectedRowsData([]);
        }
    }, [getRowsSelected, getDalSanhuu]);

    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [comments, setComments] = useState({});
    const [showShiljuuleh, setShowShiljuuleh] = useState(false);
    const [showRemove, setShowRemove] = useState(false);
    const [removeComments, setRemoveComments] = useState({});
    const [showPrintModal, setShowPrintModal] = useState(false);
    const removeSelectedRow = (rowId) => {
        const updatedRows = selectedRowsData.filter((row) => row.id !== rowId);

        setSelectedRowsData(updatedRows);

        // Datatable selection-оос ч бас хасна
        const updatedIndexes = updatedRows.map((row) =>
            getDalSanhuu.findIndex((r) => r.id === row.id)
        );
        setRowsSelected(updatedIndexes);

        // comment устгах
        const updatedComments = { ...comments };
        delete updatedComments[rowId];
        setComments(updatedComments);

        // хэрвээ бүгд устсан бол modal хаана
        if (updatedRows.length === 0) {
            setShowShiljuuleh(false);
        }
    };
    const handleSave = () => {
        // хоосон comment шалгах
        for (let row of selectedRowsData) {
            if (!comments[row.id]?.trim()) {
                Swal.fire({
                    icon: "warning",
                    title: "Анхаар!",
                    text: "Бүх мөрөнд тэмдэглэл оруулна уу",
                });
                return;
            }
        }

        axios
            .post("/archive/DalanJilSanhuu", {
                data: selectedRowsData.map((row) => ({
                    id: row.id,
                    ustgasan_temdeglel: comments[row.id],
                })),
            })
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: res.data.msg || "Амжилттай хадгалагдлаа",
                }).then(() => {
                    //  БҮРЭН ХААХ
                    setShowShiljuuleh(false); // archive modal
                    setComments({});
                    setRowsSelected([]); // selection цэвэрлэх
                    onClose(); //  ЭЦЭГ MODAL ХААХ
                    refreshDalSanhuu();
                });
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Алдаа гарлаа",
                });
            });
    };

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-dialog-scrollable custom-modal"
                style={{ maxWidth: "90vw" }}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">📂 Архивт шилжүүлэх</h4>
                        <button
                            type="button"
                            className="close"
                            onClick={() => {
                                // Сонгогдсон мөрийг цэвэрлэх
                                setclickedRowData(null);
                                setSelectedRowsData([]);
                                setRowsSelected([]);
                                setComments({});
                                setShowShiljuuleh(false);
                                setShowRemove(false);
                                setRemoveComments({});
                                setShowPrintModal(false);

                                // Эцэг onClose дуудна
                                onClose();
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="px-4 py-3 bg-light border-bottom d-flex flex-wrap gap-3 align-items-center">
                            <span>
                                <b>Хөмрөг:</b> {rowData?.humrug_ner || "-"}
                            </span>
                            <span>|</span>
                            <span>
                                <b>Бүртгэлийн дугаар:</b>{" "}
                                {rowData?.dans_ner || "-"}
                            </span>
                            <span>|</span>
                            <span>
                                <b>ХН төрөл:</b> {rowData?.dans_baidal || "-"}
                            </span>
                            <span>|</span>
                            <span>
                                <b>Нууцын зэрэг:</b>{" "}
                                <span className="badge bg-warning text-dark">
                                    {rowData?.hadgalah_hugatsaa || "-"}
                                </span>
                            </span>
                        </div>

                        <MUIDatatable
                            data={getDalSanhuu}
                            setdata={setRowsSelected} // Сонгогдсон мөрийн индекс
                            columns={columns}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={false}
                            isHideEdit={false}
                            options={{
                                responsive: "standard",
                                selectableRows: "multiple", // ✅ олон мөр сонгох
                                rowsPerPage: 10,
                                rowsPerPageOptions: [10, 20, 50],
                                download: false,
                                print: false,
                                viewColumns: false,
                                filter: true,
                                search: true,
                                fixedHeader: true,
                                tableBodyHeight: "50vh",
                                onRowSelectionChange: (
                                    currentRowsSelected,
                                    allRowsSelected
                                ) => {
                                    setRowsSelected(
                                        allRowsSelected.map((r) => r.dataIndex)
                                    );
                                },
                            }}
                        />

                        {showShiljuuleh && selectedRowsData.length > 0 && (
                            <div
                                className="modal show d-block"
                                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                            >
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">
                                                Архивт шилжүүлсэн тухай
                                                тэмдэглэл
                                            </h5>
                                            <button
                                                className="close"
                                                onClick={() => {
                                                    setShowShiljuuleh(false);
                                                    setComments({});
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="modal-body">
                                            {selectedRowsData.map(
                                                (row, index) => (
                                                    <div
                                                        key={row.id}
                                                        className="border rounded p-3 mb-3 bg-light"
                                                    >
                                                        <div className="mb-2 d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <div>
                                                                    <b>
                                                                        {index +
                                                                            1}
                                                                        .
                                                                        Дугаар:
                                                                    </b>{" "}
                                                                    {row.hadgalamj_dugaar ||
                                                                        "-"}
                                                                </div>
                                                                <div>
                                                                    <b>
                                                                        Хадгаламжийн
                                                                        нэгжийн
                                                                        гарчиг:
                                                                    </b>{" "}
                                                                    {row.hadgalamj_garchig ||
                                                                        "-"}
                                                                </div>
                                                            </div>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Сонголтоос хасах"
                                                                onClick={() =>
                                                                    removeSelectedRow(
                                                                        row.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>

                                                        {/* input нь доор нь */}
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Тэмдэглэл оруулна уу"
                                                            value={
                                                                comments[
                                                                    row.id
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setComments({
                                                                    ...comments,
                                                                    [row.id]:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-success"
                                                disabled={selectedRowsData.some(
                                                    (r) =>
                                                        !comments[r.id]?.trim()
                                                )}
                                                onClick={handleSave}
                                            >
                                                Хадгалах
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    setShowShiljuuleh(false);
                                                    setComments({});
                                                }}
                                            >
                                                <i className="fas fa-times"></i>{" "}
                                                Хаах
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DalanJIlSanhuuPrint
                            show={showPrintModal}
                            onClose={() => setShowPrintModal(false)}
                            selectedRowsData={selectedRowsData}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-outline-danger d-flex align-items-center gap-2"
                            onClick={() => {
                                if (
                                    !getRowsSelected ||
                                    getRowsSelected.length === 0
                                ) {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "Анхааруулга",
                                        text: "Та дор хаяж нэг мөр сонгоно уу!",
                                    });
                                    return;
                                }
                                // ✅ Сонгосон мөрүүдийг DalanJIlSanhuuPrint рүү дамжуулах
                                setShowPrintModal(true);
                            }}
                        >
                            <i className="fas fa-trash-alt"></i>
                            Устгах жагсаалт болон акт үүсгэх
                        </button>
                        <button
                            className="btn btn-success d-flex align-items-center gap-2"
                            onClick={() => {
                                if (
                                    !getRowsSelected ||
                                    getRowsSelected.length === 0
                                ) {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "Анхааруулга",
                                        text: "Та дор хаяж нэг мөр сонгоно уу!",
                                        confirmButtonText: "Ойлголоо",
                                    });
                                    return;
                                }

                                // ✔ мөр сонгосон үед
                                setShowShiljuuleh(true);
                            }}
                        >
                            <i className="fas fa-file-export"></i>
                            Архивт шилжүүлэх болон устгах
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                // Сонгогдсон мөрийг цэвэрлэх
                                setclickedRowData(null);
                                setSelectedRowsData([]);
                                setRowsSelected([]);
                                setComments({});
                                setShowShiljuuleh(false);
                                setShowRemove(false);
                                setRemoveComments({});
                                setShowPrintModal(false);

                                // Эцэг onClose дуудна
                                onClose();
                            }}
                        >
                            Хаах
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DalanJilSanhuuShiljuuleh;
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
        name: "hadgalamj_dugaar",
        label: "Дугаар",
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
        name: "hadgalamj_garchig",
        label: "Хадгаламжийн нэгжийн гарчиг",
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
        name: "hadgalamj_zbn",
        label: "Зохион байгуулалтын нэгжийн нэр",
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
        name: "hergiin_indeks",
        label: "Хэргийн индекс",
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
        name: "harya_on",
        label: "Харьяа он",
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
        name: "on_ehen",
        label: "Эхэлсэн он,сар,өдөр",
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
        name: "on_suul",
        label: "Дууссан он,сар,өдөр",
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
        label: "Хуудасны тоо",
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
        label: "Хавсралтын тоо",
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
        name: "jagsaalt_zuildugaar",
        label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар",
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
        name: "hn_tailbar",
        label: "Тайлбар",
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
    { label: "Дугаар", key: "hadgalamj_dugaar" },
    { label: "Хадгаламжийн нэгжийн гарчиг", key: "hadgalamj_garchig" },
    { label: "Зохион байгуулалтын нэгжийн нэр", key: "hadgalamj_zbn" },
    { label: "Хэргийн индекс", key: "hergiin_indeks" },
    { label: "Харьяа он ", key: "harya_on" },
    { label: "Эхэлсэн он,сар,өдөр", key: "on_ehen" },
    { label: "Дууссан он,сар,өдөр", key: "on_suul" },
    { label: "Хуудасны тоо", key: "huudas_too" },
    { label: "Хавсралтын тоо", key: "habsralt_too" },
    {
        label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар",
        key: "jagsaalt_zuildugaar",
    },
    { label: "Тайлбар", key: "hn_tailbar" },
];
