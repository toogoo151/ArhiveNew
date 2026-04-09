import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import HuseltEdit from "./HuseltEdit";
import HuseltNew from "./HuseltNew";
import useAuthPermission from "../../../useAuthPermission";
import Spinner from "../../../Spinner";
import LavlagaaHuseltTabs from "./LavlagaaHuseltTabs";

const Huselt = () => {
    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);
    // ================= DATA =================
    const [allHuselt, setAllHuselt] = useState([]);
    const [getHuselt, setHuselt] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [editRequestId, setEditRequestId] = useState(0);

    // Don't let Bootstrap auto-open the edit modal before React fills the form.
    // We'll open it programmatically inside `LavlagaaEdit`.
    const [showModal] = useState(null);
    const { tubshin, loading, error } = useAuthPermission();

    // FETCH
    useEffect(() => {
        refreshHuselt();
    }, []);

    const refreshHuselt = () => {
        axios
            .get("/get/huselt")
            .then((res) => {
                setRowsSelected([]);
                setAllHuselt(res.data.data);
                setHuselt(res.data.data); // анх бүх өгөгдөл
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
            setclickedRowData(getHuselt[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getHuselt]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setHuselt(allHuselt);
            return;
        }
    }, [isFilterActive, allHuselt]);

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
            setclickedRowData(getHuselt[getRowsSelected[0]]);
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
                    .post("/delete/huselt", {
                        id: getHuselt[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshHuselt();
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
            label: "#",
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
            name: "burtgel_dugaar",
            label: "Бүртгэлийн дугаар",
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
            name: "huselt_ognoo",
            label: "Хүсэлт гаргасан огноо",
            type: 'date',
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
            name: "user_burt_dugaar",
            label: "Хүсэлт захиалагчийн бүртгэлийн дугаар",
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
            name: "user_register",
            label: "Захиалагчийн регистер",
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
            name: "user_name",
            label: "Захиалагчийн нэр",
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
            name: "user_location",
            label: "Захиалагчийн хаяг",
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
            name: "user_phonenumber",
            label: "Захиалагчийн утасны дугаар",
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
            name: "huselt_turul_id",
            label: "Хүсэлтийн төрөл ",
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
                    const row = getHuselt[dataIndex];
                    const turul = row?.huselt_turul;
                    if (turul) {
                        return (
                            turul.name ??
                            turul.turul_name ??
                            row.huselt_turul_id ??
                            "—"
                        );
                    }
                    return row?.huselt_turul_id ?? "—";
                },
            },
        },

        {
            name: "huselt_aguulga",
            label: "Хүсэлтийн агуулга, гарчиг",
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
            name: "ajiltan_info",
            label: "Ажилтны овог, нэр, албан тушаал ",
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

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center mb-4">Хүсэлтийн бүртгэл</h1>
                        <LavlagaaHuseltTabs />
                        {/* TABLE */}
                        <MUIDatatable
                            data={getHuselt}
                            setdata={setHuselt}
                            sortOrder={{ name: "id", direction: "desc" }}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#HuseltNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelTitle="Хүсэлтийн жагсаалт"
                                    excelDownloadData={getHuselt}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={isRestricted}
                                    isHideEdit={isRestricted}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#HuseltEdit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={isRestricted}
                            isHideEdit={isRestricted}
                        />

                        <HuseltNew refreshHuselt={refreshHuselt} />
                        <HuseltEdit
                            setRowsSelected={setRowsSelected}
                            refreshHuselt={refreshHuselt}
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

export default Huselt;

const excelHeaders = [
    { label: "id", key: "id" },
    { label: "Бүртгэлийн дугаар", key: "burtgel_dugaar" },
    { label: "Хүсэлт гаргасан огноо", key: "huselt_ognoo" },
    { label: "Хүсэлт захиалагчийн бүртгэлийн дугаар", key: "user_burt_dugaar" },
    { label: "Захиалагчийн регистер", key: "user_register" },
    { label: "Захиалагчийн нэр", key: "user_name" },
    { label: "Захиалагчийн хаяг", key: "user_location" },
    { label: "Захиалагчийн утасны дугаар", key: "user_phonenumber" },
    { label: "Хүсэлтийн төрөл", key: "huselt_turul_id" },
    { label: "Хүсэлтийн агуулга, гарчиг", key: "huselt_aguulga" },
    { label: "Ажилтны овог, нэр, албан тушаал", key: "ajiltan_info" },
];
