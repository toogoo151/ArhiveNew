import { format, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";
import JagsaaltEdit from "./JagsaaltEdit";
import JagsaaltNew from "./JagsaaltNew";

const MERGE_COLUMN = "jagsaalt_turul";

/** Compute rowSpan per row for Жагсаалтын төрөл: same consecutive value = one merged cell. */
function computeMergeRowSpans(data) {
    if (!data || !data.length) return [];
    const spans = [];
    let i = 0;
    while (i < data.length) {
        const val = String(data[i][MERGE_COLUMN] ?? "");
        let count = 1;
        while (i + count < data.length && String(data[i + count][MERGE_COLUMN] ?? "") === val) {
            count++;
        }
        spans[i] = count;
        for (let j = 1; j < count; j++) spans[i + j] = 0;
        i += count;
    }
    return spans;
}

const Index = () => {
    // ================= DATA =================
    const [allJagsaalt, setAllJagsaalt] = useState([]);
    const [getJagsaalt, setJagsaalt] = useState([]);
    const [getRowsSelected, setRowsSelected] = useState([]);
    const [clickedRowData, setclickedRowData] = useState(null);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);
    const [editRequestId, setEditRequestId] = useState(0);

    // Don't let Bootstrap auto-open the edit modal before React fills it.
    // We open it programmatically inside `JagsaaltEdit`.
    const [showModal] = useState(null);

    // ================= FILTERS =================
    const [getJname, setGetJname] = useState([]);
    const [getRetention, setGetRetention] = useState([]);
    const [selectedJname, setSelectedJname] = useState(0);
    const [selectedRetention, setSelectedRetention] = useState(0);



    // FETCH
    useEffect(() => {
        refreshJagsaalt();
    }, []);

    const refreshJagsaalt = () => {
        axios
            .get("/get/jagsaalt")
            .then((res) => {
                setRowsSelected([]);
                setAllJagsaalt(res.data);
                setJagsaalt(res.data); // анх бүх өгөгдөл (filters will re-apply via effect)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //  ROW SELECT
    useEffect(() => {
        if (getRowsSelected[0] !== undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getJagsaalt[getRowsSelected[0]]);
        }
    }, [getRowsSelected, getJagsaalt]);

    // Apply filters whenever inputs or data change
    useEffect(() => {
        let filteredData = allJagsaalt;

        if (selectedJname !== 0) {
            const selectedJ = getJname.find((el) => Number(el.id) === selectedJname);
            filteredData = filteredData.filter(
                (item) =>
                    String(item.jagsaalt_turul) === String(selectedJname) ||
                    (selectedJ?.jName &&
                        String(item.jagsaalt_turul) === String(selectedJ.jName))
            );
        }

        if (selectedRetention !== 0) {
            filteredData = filteredData.filter(
                (item) => Number(item.hugatsaa_turul) === selectedRetention
            );
        }

        setJagsaalt(filteredData);
    }, [allJagsaalt, selectedJname, selectedRetention, getJname]);

    const btnEdit = () => {
        // Ensure edit modal receives selected row immediately on first click
        if (getRowsSelected[0] !== undefined) {
            setclickedRowData(getJagsaalt[getRowsSelected[0]]);
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
                    .post("/delete/jagsaalt", {
                        id: getJagsaalt[getRowsSelected[0]].id,
                    })
                    .then((res) => {
                        Swal.fire(res.data.msg);
                        refreshJagsaalt();
                    })
                    .catch((err) => {
                        Swal.fire(err.response?.data?.msg || "Алдаа гарлаа");
                    });
            }
        });
    };
    useEffect(() => {
        // Fetch distinct jName values
        axios
            .get("/get/jagsaaltTurul")
            .then((res) => {
                setGetJname(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        // Fetch retention options
        axios
            .get("/get/hugatsaaTurul")
            .then((res) => {
                setGetRetention(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // (debug logging removed)

    /** Row spans for Жагсаалтын төрөл: merge consecutive same values into one cell. */
    const jagsaaltRowSpans = useMemo(
        () => computeMergeRowSpans(getJagsaalt),
        [getJagsaalt]
    );

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
                        return rowIndex + 1;
                    },
                //     if (rowIndex == 0) {
                //         return rowIndex + 1;
                //     } else {
                //         return rowIndex + 1;
                //     }
                // },
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
            name: "jagsaalt_turul",
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
                customBodyRender: (value) => {
                    if (value === null || value === "" || value === 0 || value === undefined) {
                        return "-";
                    }
                    // value may be stored as id or as text (jName). Handle both.
                    const foundById = getJname.find((el) => String(el.id) === String(value));
                    if (foundById) return foundById.jName;
                    const foundByName = getJname.find((el) => String(el.jName) === String(value));
                    return foundByName?.jName ?? value;
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

    /** Custom row render: merge "Жагсаалтын төрөл" cells when same name in consecutive rows. */
    const customRowRender = (data, dataIndex) => {
        const rowIndex = dataIndex;
        const row = data && typeof data === "object" && !Array.isArray(data) ? data : getJagsaalt[rowIndex];
        if (!row) return null;

        const renderCellValue = (col, value) => {
            if (value === null || value === "" || value === 0 || value === undefined) return "-";
            if (col.name === MERGE_COLUMN) {
                const foundById = getJname.find((el) => String(el.id) === String(value));
                if (foundById) return foundById.jName;
                const foundByName = getJname.find((el) => String(el.jName) === String(value));
                return foundByName?.jName ?? value;
            }
            const opt = col.options?.customBodyRender;
            return opt ? opt(value) : value;
        };

        const isSelected = getRowsSelected.length && getRowsSelected[0] === dataIndex;

        return (
            <TableRow
                hover
                selected={isSelected}
                onClick={() => setRowsSelected([dataIndex])}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                key={dataIndex}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => setRowsSelected([dataIndex])}
                    />
                </TableCell>
                {columns.map((col) => {
                    if (col.name === MERGE_COLUMN) {
                        const span = jagsaaltRowSpans[rowIndex];
                        if (span === 0) return null;
                        const value = row[col.name];
                        return (
                            <TableCell
                                key={col.name}
                                rowSpan={span}
                                style={{ verticalAlign: "middle" }}
                            >
                                {renderCellValue(col, value)}
                            </TableCell>
                        );
                    }
                    const value = col.name === "id" ? dataIndex + 1 : row[col.name];
                    return (
                        <TableCell key={col.name} align={col.options?.align || (col.name === "id" ? "center" : undefined)}>
                            {col.name === "id" ? value : renderCellValue(col, value)}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    };

    //RENDER
    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h1 className="text-center mb-4">Хадгалах хугацааны зүйлийн жагсаалт</h1>
                        {/* FILTERS */
                        <div className="col-md-8 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            Жагсаалтын төрөл:
                                                        </span>

                                                        <select
                                                            className="form-control"
                                                            value={selectedJname}
                                                            onChange={(e) => {
                                                                const value = Number(e.target.value);
                                                                setSelectedJname(value);

                                                                // 0 сонгосон бол alert
                                                                // if (value === 0) {
                                                                //     Swal.fire({
                                                                //         icon: "warning",
                                                                //         title: "Анхаар!",
                                                                //         text: "Жагсаалтын төрөл сонгоно уу",
                                                                //     });
                                                                // }
                                                            }}
                                                        >
                                                            <option value={0}>Сонгоно уу</option>
                                                            {getJname.map((el) => (
                                                                <option
                                                                    key={el.id}
                                                                    value={el.id}
                                                                >
                                                                    {el.jName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className="mx-2"></span>
                                                        <span className="input-group-text">
                                                            Хадгалах хугацаа:
                                                        </span>

                                                        <select
                                                            className="form-control"
                                                            value={selectedRetention}
                                                            onChange={(e) => {
                                                                const value = Number(e.target.value);
                                                                setSelectedRetention(value);
                                                                // if (value === 0) {
                                                                //     Swal.fire({
                                                                //         icon: "warning",
                                                                //         title: "Анхаар!",
                                                                //         text: "Хадгалах хугацааг сонгоно уу",
                                                                //     });
                                                                // }
                                                            }}
                                                        >
                                                            <option value={0}>Сонгоно уу</option>
                                                            {getRetention.map((el) => (
                                                                <option key={el.id} value={el.id}>
                                                                    {el.RetName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>}

                        {/* TABLE */}
                        <MUIDatatable
                            data={getJagsaalt}
                            setdata={setJagsaalt}
                            columns={columns}
                            customRowRender={customRowRender}
                            sortOrder={{ name: "id", direction: "desc" }}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName="btn btn-success"
                                    modelType="modal"
                                    dataTargetID="#jagsaaltNew"
                                    spanIconClassName="fas fa-plus"
                                    buttonName="Нэмэх"
                                    excelDownloadData={getJagsaalt}
                                    excelHeaders={excelHeaders}
                                    isHideInsert={true}
                                    onClick={() => {
                                                                            if (
                                                                                selectedJname === 0 ||
                                                                                selectedRetention === 0
                                                                            ) {
                                                                                // Сонголт хийгээгүй бол зөвхөн анхааруулах
                                                                                // Swal.fire({
                                                                                //     icon: "warning",
                                                                                //     title: "Анхааруулга",
                                                                                //     text: "Жагсаалтын төрөл болон хадгалах хугацааг сонгоно уу!",
                                                                                // });
                                                                            }
                                                                            // else блокоор modal автоматаар нээгдэх учраас өөр юу ч хийх шаардлагагүй
                                                                        }}
                                />
                            }
                            btnEdit={btnEdit}
                            modelType={showModal}
                            editdataTargetID="#jagsaaltedit"
                            btnDelete={btnDelete}
                            getRowsSelected={getRowsSelected}
                            setRowsSelected={setRowsSelected}
                            isHideDelete={true}
                            isHideEdit={true}
                        />

                        <JagsaaltNew refreshJagsaalt={refreshJagsaalt} />
                        <JagsaaltEdit
                            setRowsSelected={setRowsSelected}
                            refreshJagsaalt={refreshJagsaalt}
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
    // We store/display the text in `jagsaalt_turul`
    { label: "Жагсаалтын төрөл", key: "jagsaalt_turul" },
    { label: "Баримт төрөл", key: "barimt_turul" },
    { label: "Баримтын дэд төрөл", key: "barimt_dedturul" },
    { label: "Дэс дугаар", key: "barimt_dd" },
    { label: "Баримтын нэр", key: "barimt_ner" },
    { label: "Хадгалах хугацааны төрөл", key: "RetName" },
    { label: "Хадгалах хугацаа", key: "hugatsaa" },
    { label: "Тайлбар", key: "tailbar" },
    { label: "Товчлол", key: "tobchlol" },
];
