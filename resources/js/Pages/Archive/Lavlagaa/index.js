import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import NomEdit from "./NomEdit";
import NomNew from "./NomNew";
const Index = () => {

    // ================= FILTER CONTROL =================
    const [isFilterActive, setIsFilterActive] = useState(false);

    // ================= DATA =================
    const [allNom, setallNom] = useState([]);
    const [getNom, setNom] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [editRequestId, setEditRequestId] = useState(0);
    const [searchForm, setSearchForm] = useState({
        humrugDugaar: "",
        humrugNer: "",
        dansDugaar: "",
        dansNer: "",
        nomDugaar: "",
        nomNer: "",
        beginDate: "",
        endDate: "",
    });

    // Don't let Bootstrap auto-open the edit modal before React fills the form.
    // We'll open it programmatically inside `NomEdit`.
    const [showModal] = useState(null);

    // FETCH
    useEffect(() => {
        refreshNom();
    }, []);

    const refreshNom = () => {
        axios
            .get("/get/ashignoms")
            .then((res) => {
                setRowsSelected([]);
                setallNom(res.data);
                setNom  (res.data); // анх бүх өгөгдөл
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
            setclickedRowData(getNom[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getNom]);

    //  DATE FILTER
    useEffect(() => {
        if (!isFilterActive) {
            setNom(allNom);
            return;
        }

    }, [isFilterActive,  allNom]);
    const btnEdit = () => {
        // Ensure the edit modal gets the selected row immediately on first click
        if (getRowsSelected[0] !== undefined) {
            setclickedRowData(getNom[getRowsSelected[0]]);
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
                    .post("/delete/ashignom", {
                        id: getNom[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshNom();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const {
            humrugDugaar,
            humrugNer,
            dansDugaar,
            dansNer,
            nomDugaar,
            nomNer,
            beginDate,
            endDate,
        } = searchForm;

        const filtered = allNom.filter((item) => {
            const createdAt = item?.created_at
                ? new Date(item.created_at).getTime()
                : null;
            const from = beginDate ? new Date(beginDate).getTime() : null;
            const to = endDate ? new Date(endDate).getTime() : null;

            const matchesDateRange =
                (!from || (createdAt && createdAt >= from)) &&
                (!to || (createdAt && createdAt <= to));

            return (
                (item?.humrug_dugaar || "")
                    .toString()
                    .toLowerCase()
                    .includes(humrugDugaar.toLowerCase()) &&
                (item?.humrug_ner || "")
                    .toLowerCase()
                    .includes(humrugNer.toLowerCase()) &&
                (item?.dans_dugaar || "")
                    .toString()
                    .toLowerCase()
                    .includes(dansDugaar.toLowerCase()) &&
                (item?.dans_ner || "")
                    .toLowerCase()
                    .includes(dansNer.toLowerCase()) &&
                (item?.nom_dugaar || "")
                    .toString()
                    .toLowerCase()
                    .includes(nomDugaar.toLowerCase()) &&
                (item?.nom_ners || "")
                    .toLowerCase()
                    .includes(nomNer.toLowerCase()) &&
                matchesDateRange
            );
        });

        setRowsSelected([]);
        setNom(filtered);
    };

    const handleClearSearch = () => {
        setSearchForm({
            humrugDugaar: "",
            humrugNer: "",
            dansDugaar: "",
            dansNer: "",
            nomDugaar: "",
            nomNer: "",
            beginDate: "",
            endDate: "",
        });
        setRowsSelected([]);
        setNom(allNom);
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
        name: "humrug_dugaar",
        label: "Хөмрөгийн дугаар",
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
        name: "humrug_ner",
        label: "Хөмрөгийн нэр",
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
        name: "dans_dugaar",
        label: "Дансны дугаар",
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
        name: "dans_ner",
        label: "Дансны нэр",
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
        name: "nom_dugaar",
        label: "Номын дугаар",
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
        name: "nom_ners",
        label: "Номын нэр",
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

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center mb-4">Ашигласан номын жагсаалт</h1>
                        <form
                            className="card card-body mb-3"
                            onSubmit={handleSearch}
                        >
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Хөмрөгийн дугаар</label>
                                    <input
                                        type="text"
                                        name="humrugDugaar"
                                        className="form-control"
                                        value={searchForm.humrugDugaar}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Хөмрөгийн нэр</label>
                                    <input
                                        type="text"
                                        name="humrugNer"
                                        className="form-control"
                                        value={searchForm.humrugNer}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Дансны дугаар</label>
                                    <input
                                        type="text"
                                        name="dansDugaar"
                                        className="form-control"
                                        value={searchForm.dansDugaar}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Дансны нэр</label>
                                    <input
                                        type="text"
                                        name="dansNer"
                                        className="form-control"
                                        value={searchForm.dansNer}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Номын дугаар</label>
                                    <input
                                        type="text"
                                        name="nomDugaar"
                                        className="form-control"
                                        value={searchForm.nomDugaar}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Номын нэр</label>
                                    <input
                                        type="text"
                                        name="nomNer"
                                        className="form-control"
                                        value={searchForm.nomNer}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Эхлэх огноо</label>
                                    <input
                                        type="date"
                                        name="beginDate"
                                        className="form-control"
                                        value={searchForm.beginDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Дуусах огноо</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control"
                                        value={searchForm.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>
                                    Цэвэрлэх
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Хайх
                                </button>
                            </div>
                        </form>
                        {/* TABLE */}
                        <MUIDatatable
                            data={getNom}
                            setdata={setNom}
                            sortOrder={{ name: "id", direction: "desc" }}
                            columns={columns}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#NomNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelDownloadData={getNom}
                                    excelHeaders={excelHeaders}
                                    excelTitle="Ашигласан номын жагсаалт"
                                    isHideInsert={true}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#NomEdit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />

                        <NomNew refreshNom={refreshNom} />
                        <NomEdit
                            setRowsSelected={setRowsSelected}
                            refreshNom={refreshNom}
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
    { label: "Хөмрөгийн дугаар", key: "humrug_dugaar" },
    { label: "Дансны дугаар", key: "dans_dugaar" },
    { label: "Номын дугаар", key: "nom_dugaar" },
    { label: "Номын нэр", key: "nom_ners" },
];
