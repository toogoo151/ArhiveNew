import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

const Retention = () => {
    // ================= DATE =================
    const today = new Date();
    const defaultStart = format(subDays(today, 30), "yyyy-MM-dd");
    const defaultEnd = format(today, "yyyy-MM-dd");

    const [getStartDate, setStartDate] = useState(defaultStart);
    const [getEndDate, setEndDate] = useState(defaultEnd);

    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);

    // ================= DATA =================
    const [allHumrug, setallHumrug] = useState([]);
    const [getRetention, setRetention] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [showModal] = useState("modal");

    // FETCH
    useEffect(() => {
        refreshRetention();
    }, []);

    const importExcel = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        axios
            .post("/import/retention", formData)
            .then((res) => {
                Swal.fire(res.data.msg); // Мэдэгдэл
                refreshRetention(); // <-- Table refresh хийж өгөгдөл шинэчлэгдэх
            })
            .catch((err) => {
                Swal.fire("Import алдаа");
            });
    };

    const refreshRetention = () => {
        axios
            .get("/get/RetentionTuslah")
            .then((res) => {
                setRowsSelected([]);
                setallHumrug(res.data);
                setRetention(res.data); // анх бүх өгөгдөл
                setIsFilterActive(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //  ROW SELECT
    useEffect(() => {
        if (getRowsSelected[0] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getRetention[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getRetention]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setRetention(allHumrug);
            return;
        }

        if (!getStartDate || !getEndDate) return;

        const start = new Date(getStartDate);
        const end = new Date(getEndDate);

        const filtered = allHumrug.filter((item) => {
            if (!item.ognoo) return false;
            const itemDate = new Date(item.ognoo);
            return itemDate >= start && itemDate <= end;
        });

        setRetention(filtered);
    }, [isFilterActive, getStartDate, getEndDate, allHumrug]);

    const btnEdit = () => {
        setIsEditBtnClick(true);
    };

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
                    .post("/delete/humrug", {
                        id: getRetention[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshRetention();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center mb-4">Хадгалах жил</h1>

                        {/* TABLE */}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="humrugExcel" className="form-label">
                                Excel Import
                            </label>
                            <div className="d-flex align-items-center">
                                {/* Файл сонгох input */}
                                <input
                                    type="file"
                                    id="humrugExcel"
                                    className="form-control form-control-sm me-2"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        if (e.target.files.length)
                                            setSelectedFile(e.target.files[0]);
                                    }}
                                />

                                {/* Файл сонгогдсон үед л Import товч гарч ирнэ */}
                                {selectedFile && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            importExcel(selectedFile); // Excel импортлох функц дуудна
                                            setSelectedFile(null); // файлыг цэвэрлэх
                                            document.getElementById(
                                                "humrugExcel"
                                            ).value = null; // input-ыг цэвэрлэх
                                        }}
                                    >
                                        Import
                                    </button>
                                )}
                            </div>
                        </div>

                        <MUIDatatable
                            data={getRetention}
                            setdata={setRetention}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#humrugNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelDownloadData={getRetention}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#humrugedit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Retention;

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
        name: "RetName",
        label: "Ret нэр",
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
    { label: "Хөмрөгийн дугаар", key: "humrug_dugaar" },
    { label: "Хөмрөгийн нэр", key: "humrug_ner" },
    { label: "Хөмрөгийн зэрэглэл", key: "humrug_zereglel" },
    { label: "Архивт анх баримт шилжүүлсэн огноо", key: "anhnii_ognoo" },
    { label: "Хөмрөг өөрчлөлт", key: "humrug_uurchlult" },
    { label: "Өөрчлөлт огноо", key: "uurchlult_ognoo" },
    { label: "Тайлбар", key: "tailbar" },
];
