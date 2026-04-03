import { useEffect, useState } from "react";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";

import Spinner from "../../../Spinner";
import useAuthPermission from "../../../useAuthPermission";

const searchBarimt = () => {
    const [getSearchBarimt, setSearchBarimt] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]); // row clear хийж байгаа
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [showModal] = useState("modal");
    const [filters, setFilters] = useState({
        barimt_ner: "",
        barimt_dugaar: "",
        irsen_dugaar: "",
    });
    const { tubshin, loading, error } = useAuthPermission();

    useEffect(() => {
        refreshSearchbarimt();
    }, [page, rowsPerPage, filters]);
    useEffect(() => {
        if (getRowsSelected[0] != undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getSearchBarimt[getRowsSelected[0]]);
        }
    }, [getRowsSelected]);
    const refreshSearchbarimt = () => {
        setRowsSelected([]);
        const isEmpty = Object.values(filters).every(
            (v) => !v || v.trim() === ""
        );

        axios
            .get("/get/SearchBarimt", {
                params: {
                    ...(isEmpty ? {} : filters),
                    page: page + 1, // MUI Datatable-ийн page 0-based, Laravel backend 1-based
                    perPage: rowsPerPage,
                },
            })
            .then((res) => {
                console.log("FULL RESPONSE:", res);
                console.log("DATA:", res.data);
                console.log("ITEMS:", res.data.data);
                console.log("TOTAL:", res.data.total);

                setSearchBarimt(res.data.data);
                setTotal(res.data.total);
            })
            .catch((err) => {
                console.error(err);
                Swal.fire("Өгөгдөл татахад алдаа гарлаа");
            });
    };

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
        setRowsSelected([]);
        if (getSearchBarimt[getRowsSelected[0]].id != "") {
            Swal.fire({
                title: "Та устгахдаа итгэлтэй байна уу?",
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/comandlal", {
                            id: getSearchBarimt[getRowsSelected[0]].id,
                        })
                        .then((res) => {
                            Swal.fire(res.data.msg);
                            refreshSearchbarimt();
                        })
                        .catch((err) => {
                            Swal.fire(err.response.data.msg);
                        });
                } else if (result.isDenied) {
                    // Swal.fire("Changes are not saved", "", "info");
                }
            });
        }
    };
    const btnEdit = () => {
        setIsEditBtnClick(true);
    };

    const config = {
        // page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        // show_pagination: true,
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
                    const files = value
                        .split(";")
                        .filter((f) => f.trim() !== "");

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

    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h4 className="text-center mb-4">
                            Баримт бичиг хайлтын хэсэг
                        </h4>
                        <div className="row mb-3">
                            <div className="col">
                                <input
                                    placeholder="Баримт нэр"
                                    className="form-control"
                                    value={filters.barimt_ner} // ← value-г state-тэй холбоно
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            barimt_ner: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    placeholder="Баримт дугаар"
                                    className="form-control"
                                    value={filters.barimt_dugaar}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            barimt_dugaar: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    placeholder="Ирсэн дугаар"
                                    className="form-control"
                                    value={filters.irsen_dugaar}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            irsen_dugaar: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    placeholder="Явсан дугаар"
                                    className="form-control"
                                    value={filters.yabsan_dugaar}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            yabsan_dugaar: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    placeholder="Үйлдсэн газар"
                                    className="form-control"
                                    value={filters.uild_gazar}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            uild_gazar: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    placeholder="Агуулга"
                                    className="form-control"
                                    value={filters.aguulga}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            aguulga: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    placeholder="Бүртгэсэн ажилтан"
                                    className="form-control"
                                    value={filters.bichsen_ner}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            bichsen_ner: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col">
                                {/* <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setPage(0); // 🔥 ЧУХАЛ
                                        refreshSearchbarimt(); // 🔥 ЭНЭГҮЙ БАЙСАН
                                    }}
                                >
                                    Хайх
                                </button> */}
                                {/* <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setFilters({
                                            barimt_ner: "",
                                            barimt_dugaar: "",
                                            irsen_dugaar: "",
                                            yabsan_dugaar: "",
                                            uild_gazar: "",
                                            aguulga: "",
                                            bichsen_ner: "",
                                        });

                                        setPage(0);
                                    }}
                                >
                                    Цэвэрлэх
                                </button> */}
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setFilters({
                                            barimt_ner: "",
                                            barimt_dugaar: "",
                                            irsen_dugaar: "",
                                            yabsan_dugaar: "",
                                            uild_gazar: "",
                                            aguulga: "",
                                            bichsen_ner: "",
                                        });
                                        setPage(0);
                                        refreshSearchbarimt();
                                    }}
                                >
                                    Цэвэрлэх
                                </button>
                            </div>
                        </div>
                        <MUIDatatable
                            data={getSearchBarimt}
                            columns={columns}
                            isServerSide={true}
                            // serverSide={true}
                            count={total}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            setPage={setPage}
                            setRowsPerPage={setRowsPerPage}
                            options={{
                                // serverSide: true,
                                // count: totalRows,

                                // page: page,
                                // rowsPerPage: rowsPerPage,
                                onTableChange: (action, tableState) => {
                                    console.log("ACTION:", action);
                                    console.log("TABLE STATE:", tableState);

                                    switch (action) {
                                        case "changePage":
                                            setPage(tableState.page);
                                            break;
                                        case "changeRowsPerPage":
                                            setRowsPerPage(
                                                tableState.rowsPerPage
                                            );
                                            break;
                                    }
                                },

                                setRowProps: (row, dataIndex) => {
                                    const r = getBaingaIlt[dataIndex];
                                    if (isExpiredRow(r)) {
                                        return {
                                            style: {
                                                backgroundColor: "#fee2e2",
                                            },
                                        };
                                    }
                                    return {};
                                },
                            }}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#comandlalNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"Нэмэх"}
                                    excelDownloadData={getSearchBarimt}
                                    excelHeaders={excelHeaders}
                                    excelTitle="Командлал"
                                    isHideInsert={false}
                                    isHideEdit={false}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID={"#comandlalEdit"}
                            btnDelete={btnDelete}
                            avgColumnIndex={-1}
                            avgColumnName={"email"}
                            avgName={"Дундаж: "}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={false}
                            isHideEdit={false}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default searchBarimt;
