import { useEffect, useState } from "react";
import CustomToolbar from "../../../components/Admin/general/MUIDatatable/CustomToolbar";
import MUIDatatable from "../../../components/Admin/general/MUIDatatable/MUIDatatable";

import Swal from "sweetalert2";
import "../../../../styles/muidatatable.css";
import axios from "../../../AxiosUser";

import Spinner from "../../../Spinner";
import useAuthPermission from "../../../useAuthPermission";

const searchNegj = () => {
    const [getNegj, setNegj] = useState([]);

    const [getRowsSelected, setRowsSelected] = useState([]); // row clear хийж байгаа
    const [clickedRowData, setclickedRowData] = useState([]);
    const [isEditBtnClick, setIsEditBtnClick] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [userList, setUserList] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [yearList, setYearList] = useState([]);
    const [totalAll, setTotalAll] = useState(0);

    const [showModal] = useState("modal");

    const { tubshin, loading, error } = useAuthPermission();
    const hTypeOptions = [
        { value: 1, label: "Байнга хадгалах илт" },
        { value: 3, label: "70 жил Хүний нөөц" },
        { value: 4, label: "70 жил Санхүү" },
        { value: 5, label: "Түр хадгалах Илт" },
    ];
    useEffect(() => {
        refreshNegj();
    }, [
        page,
        rowsPerPage,
        selectedMonth,
        selectedUser,
        selectedType,
        selectedYear,
    ]);

    useEffect(() => {
        if (getRowsSelected[0] != undefined) {
            setIsEditBtnClick(false);
            setclickedRowData(getNegj[getRowsSelected[0]]);
        }
    }, [getRowsSelected]);
    const refreshNegj = () => {
        axios
            .get("/get/LogNegj", {
                params: {
                    page: page + 1,
                    perPage: rowsPerPage,
                    month: selectedMonth,
                    user_id: selectedUser,
                    year: selectedYear,
                    h_type: selectedType,
                },
            })
            .then((res) => {
                setNegj(res.data.data || []);
                setTotal(res.data.total || 0);
                setUserList(res.data.users || []);
                setYearList(res.data.years || []);
                setTotalAll(res.data.totalAll || 0); // бүх
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
        if (getNegj[getRowsSelected[0]].id != "") {
            Swal.fire({
                title: "Та устгахдаа итгэлтэй байна уу?",
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/comandlal", {
                            id: getNegj[getRowsSelected[0]].id,
                        })
                        .then((res) => {
                            Swal.fire(res.data.msg);
                            refreshNegj();
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
    const excelData = getNegj.map((row) => {
        let hTypeText;
        switch (row.h_type) {
            case 1:
                hTypeText = "Байнга хадгалах илт";
                break;
            case 3:
                hTypeText = "70 жил Хүний нөөц";
                break;
            case 4:
                hTypeText = "70 жил Санхүү";
                break;
            case 5:
                hTypeText = "Түр хадгалах Илт";
                break;
            default:
                hTypeText = "-";
        }

        return {
            ...row,
            h_type: hTypeText, // Excel-д текстээр гарах
        };
    });

    return (
        <>
            <div className="row">
                <div className="info-box">
                    <div className="col-md-12">
                        <h4 className="text-center mb-4">
                            Хадгаламжийн нэгж(Бүртгэл)
                        </h4>
                        <div className="d-flex mb-3 gap-2">
                            <select
                                className="form-control"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Бүх жил</option>
                                {yearList.map((year) => (
                                    <option key={year} value={year}>
                                        {year} он
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-control"
                                value={selectedMonth}
                                onChange={(e) => {
                                    setSelectedMonth(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Бүх сар</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1} сар
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control"
                                value={selectedUser}
                                onChange={(e) => {
                                    setSelectedUser(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Бүх хэрэглэгч</option>
                                {userList.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.hereglegch_ner}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control"
                                value={selectedType}
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Бүх төрөл</option>
                                {hTypeOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <div className="ms-2">
                                <span className="badge bg-secondary me-1">
                                    Нийт: {totalAll}
                                </span>
                                <span className="badge bg-primary">
                                    Шүүлт: {total}
                                </span>
                            </div>
                        </div>
                        <MUIDatatable
                            data={getNegj}
                            setdata={setNegj}
                            columns={columns}
                            isServerSide={true}
                            count={total}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            setPage={setPage}
                            setRowsPerPage={setRowsPerPage}
                            options={{
                                onTableChange: (action, tableState) => {
                                    switch (action) {
                                        case "changePage":
                                            setPage(tableState.page);
                                            break;

                                        case "changeRowsPerPage":
                                            setRowsPerPage(
                                                tableState.rowsPerPage
                                            );
                                            setPage(0);
                                            break;

                                        default:
                                            break;
                                    }
                                },
                            }}
                            costumToolbar={
                                <CustomToolbar
                                    btnClassName={"btn btn-success"}
                                    modelType={"modal"}
                                    dataTargetID={"#comandlalNew"}
                                    spanIconClassName={"fas fa-solid fa-plus"}
                                    buttonName={"Нэмэх"}
                                    excelDownloadData={excelData}
                                    excelHeaders={excelHeaders}
                                    excelTitle="Командлал"
                                    isHideInsert={isRestricted}
                                    isHideEdit={isRestricted}
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
                            isHideDelete={isRestricted}
                            isHideEdit={isRestricted}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default searchNegj;
const columns = [
    {
        name: "id",
        label: "№",
        options: {
            filter: true,
            sort: true,
            filter: false,
            align: "center",
            customBodyRenderLite: (rowIndex, dataIndex) => {
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
        name: "humrug_ner",
        label: "Хөмрөг",
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
        label: "Данс",
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
    {
        name: "h_type",
        label: "Нэгжийн төрөл",
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
                switch (value) {
                    case 1:
                        return "Байнга хадгалах илт";
                    case 3:
                        return "70 жил Хүний нөөц";
                    case 4:
                        return "70 жил Санхүү";
                    case 5:
                        return "Түр хадгалах Илт";
                    default:
                        return "-";
                }
            },
        },
    },
    {
        name: "successful",
        label: "Үйлдэл",
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
        name: "hereglegch_ner",
        label: "Нэр",
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
        name: "created_at",
        label: "Цаг хугацаа",
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
        name: "user_ip",
        label: "Нэвтэрсэн IP",
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
    { label: "Хөмрөг", key: "humrug_ner" },
    { label: "Данс", key: "dans_ner" },
    { label: "Дугаар", key: "hadgalamj_dugaar" },
    { label: "Хадгаламжийн нэгжийн гарчиг", key: "hadgalamj_garchig" },
    { label: "Зохион байгуулалтын нэгжийн нэр", key: "hadgalamj_zbn" },
    { label: "Хэргийн индекс", key: "hergiin_indeks" },
    { label: "Харьяа он", key: "harya_on" },
    { label: "Эхэлсэн он,сар,өдөр", key: "on_ehen" },
    { label: "Дууссан он,сар,өдөр", key: "on_suul" },
    { label: "Хуудасны тоо", key: "huudas_too" },
    { label: "Хавсралтын тоо", key: "habsralt_too" },
    {
        label: "Хадгалах хугацааны жагсаалтын зүйлийн дугаар",
        key: "jagsaalt_zuildugaar",
    },
    { label: "Тайлбар", key: "hn_tailbar" },
    { label: "Нэгжийн төрөл", key: "h_type" },
    {
        label: "Үйлдэл",
        key: "successful",
    },
    { label: "Нэр", key: "hereglegch_ner" },
    { label: "Цаг хугацаа", key: "created_at" },
    { label: "Нэвтэрсэн IP", key: "user_ip" },
];
