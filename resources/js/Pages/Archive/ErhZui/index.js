import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import ErhzuiEdit from "./ErhzuiEdit";
import ErhzuiNew from "./ErhzuiNew";
import useAuthPermission from "../../../useAuthPermission";
import Spinner from "../../../Spinner";

const Index = () => {
    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);
    // ================= DATA =================
    const [allErhzui, setallErhzui] = useState([]);
    const [getErhzui, setErhzui] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [editRequestId, setEditRequestId] = useState(0);

    // Don't let Bootstrap auto-open the edit modal before React fills the form.
    // We'll open it programmatically inside `ErhzuiEdit`.
    const [showModal] = useState(null);
    const { tubshin, loading, error } = useAuthPermission();

    // FETCH
    useEffect(() => {
        refreshErhzui();
    }, []);

    const refreshErhzui = () => {
        axios
            .get("/get/erhzui")
            .then((res) => {
                setRowsSelected([]);
                setallErhzui(res.data.data);
                setErhzui(res.data.data); // анх бүх өгөгдөл
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
            setclickedRowData(getErhzui[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getErhzui]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setErhzui(allErhzui);
            return;
        }
    }, [isFilterActive, allErhzui]);

    // Get current authenticated user's tubshin on mount
    if (loading)
        return (
            <div>
                <Spinner />
            </div>
        );
    if (error) return <p>Алдаа гарлаа</p>;

    const isRestricted = tubshin === 2;

    const btnEdit = () => {
        // Ensure the edit modal gets the selected row immediately on first click
        if (getRowsSelected[0] !== undefined) {
            setclickedRowData(getErhzui[getRowsSelected[0]]);
        }
        setIsEditBtnClick(true);
        // Trigger edit modal open every click (even if already edited once)
        setEditRequestId((prev) => prev + 1);
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
                    .post("/delete/erhzui", {
                        id: getErhzui[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshErhzui();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    const columns = [
        {
            name: "id",
            label: " ",
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
            name: "erhzui_turul",
            label: "Эрх зүйн төрөл",
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
            name: "erhzui_akt_ner",
            label: "Эрх зүйн акт",
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
            name: "tailbar",
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

        {
            name: "file",
            label: "Хавсралт файл",
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: (value) => ({
                    style: {
                        backgroundColor: "#5DADE2",
                        color: "white",
                    },
                }),
                customBodyRenderLite: (dataIndex) => {
                    const row = getErhzui[dataIndex];
                    if (!row.file) return "No file";

                    let fileUrl;
                    let fileName;
                    try {
                        const parsed = JSON.parse(row.file);
                        // Uploaded with `storeAs('erhzui_files', ..., 'public')`, so the real public URL is `/storage/${parsed.path}`.
                        // (Your project has `public/storage/erhzui_files/...`, not `public/storage/app/public/...`.)
                        fileUrl = `${window.location.origin}/storage/${parsed.path}`;
                        fileName = parsed.name;
                    } catch (err) {
                        fileUrl = `${window.location.origin}/storage/${row.file}`;
                        fileName = row.file.split("/").pop();
                    }

                    const maxLabelLength = 30;
                    const truncateName = (name) => {
                        if (!name || name.length <= maxLabelLength) return name;

                        const dotIndex = name.lastIndexOf(".");
                        const extension =
                            dotIndex !== -1 ? name.slice(dotIndex) : "";
                        const baseName =
                            dotIndex !== -1 ? name.slice(0, dotIndex) : name;
                        const keep = Math.max(
                            0,
                            maxLabelLength - extension.length - 3
                        );
                        return `${baseName.slice(0, keep)}...${extension}`;
                    };

                    const label = truncateName(fileName);

                    const handleClick = (e) => {
                        e.preventDefault();
                        window.open(fileUrl, "_blank", "noopener,noreferrer");
                    };

                    return (
                        <a
                            href={fileUrl}
                            onClick={handleClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textDecoration: "none",
                                color: "#1f618d",
                            }}
                            title={fileName}
                        >
                            <i
                                className="fas fa-file-pdf"
                                style={{ color: "#e74c3c", fontSize: "1rem" }}
                            />
                            {label}
                        </a>
                    );

                    // Option 2: embed inline (only PDF)
                    // return <embed src={fileUrl} type="application/pdf" width="150px" height="100px" />;
                },
            },
        },
    ];

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center mb-4">Эрх зүйн жагсаалт</h1>
                        {/* TABLE */}
                        <MUIDatatable
                            data={getErhzui}
                            setdata={setErhzui}
                            sortOrder={{ name: "id", direction: "desc" }}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#ErhzuiNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelTitle="Эрх зүйн жагсаалт"
                                    excelDownloadData={getErhzui}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={isRestricted}
                                    isHideEdit={isRestricted}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#ErhzuiEdit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={isRestricted}
                            isHideEdit={isRestricted}
                        />

                        <ErhzuiNew refreshErhzui={refreshErhzui} />
                        <ErhzuiEdit
                            setRowsSelected={setRowsSelected}
                            refreshErhzui={refreshErhzui}
                            changeDataRow={clickedRowData}
                            isEditBtnClick={isEditBtnClick}
                            editRequestId={editRequestId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;

const excelHeaders = [
    { label: "id", key: "id" },
    { label: "Эрх зүйн төрөл", key: "erhzui_turul" },
    { label: "Эрх зүйн акт", key: "erhzui_akt_ner" },
    { label: "Тайлбар", key: "tailbar" },
    { label: "Хавсралт файл", key: "file" },
];
