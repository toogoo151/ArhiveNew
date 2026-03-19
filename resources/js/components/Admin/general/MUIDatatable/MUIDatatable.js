import { createTheme, ThemeProvider } from "@mui/material/styles";
import clsx from "clsx";
import MUIDataTable from "mui-datatables";
import { withStyles } from "tss-react/mui";
import CustomToolbarSelect from "./CustomToolbarSelect";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";


const customStyles = (theme) => ({
    GreyLine: {
    "& td": {
        backgroundColor: "#fafafa",
    },
},

});

const MUIDatatable = (props) => {
    const { classes } = props;
    const footerClasses = clsx({
        [classes.footerCell]: true,
        [classes.stickyFooterCell]: true,
    });

    const options = {
        textLabels: {
            body: {
                noMatch: "Өгөгдөл байхгүй байна...",
            },
            filter: {
                all: "Сонгоно уу",
                title: "ХАЙЛТЫН ХЭСЭГ",
                reset: "ДАХИН ТОХИРУУЛАХ",
            },
            toolbar: {
                search: "Хайх",
                print: "Хэвлэх",
                viewColumns: "Харах баганууд",
                filterTable: "Хайлтын хэсэг",
            },
            pagination: {
                next: "Following page",
                previous: "Preceding page",
                rowsPerPage: "Харах тоо:",
                displayRows: "of",
                jumpToPage: "Хуудас үсрэх",
            },
        },

        resizableColumns: true,
        download: false,
        filterType: "multiselect",
        selectableRows: "single",
        selectableRowsOnClick: true,
        selectToolbarPlacement: "replace",
        jumpToPage: true,
        rowsSelected: props.getRowsSelected,

        customTableBodyFooterRender: function (opts) {
            let isFooter = false;

            if (props.avgColumnIndex != -1) {
                isFooter = true;
            }
            // let avgAge =
            //     opts.data.reduce((accu, item) => {
            //         return accu + item.data[props.avgColumnIndex];
            //     }, 0) / opts.data.length;
            // avgAge = Math.round(avgAge);

            let avgAge = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex];
            }, 0);
            avgAge = Math.round(avgAge);

            let avgAge1 = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex1];
            }, 0);

            avgAge1 = Math.round(avgAge1);

            let avgAge2 = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex2];
            }, 0);

            avgAge2 = Math.round(avgAge2);

            let avgAge3 = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex3];
            }, 0);

            avgAge3 = Math.round(avgAge3);

            return (
                <TableFooter className={footerClasses}>
                    {isFooter && (
                        <>
                            <TableRow>
                                {opts.selectableRows !== "none" ? (
                                    <TableCell className={footerClasses} />
                                ) : null}
                                {opts.columns.map((col, index) => {
                                    if (col.display === "true") {
                                        if (col.name === props.avgColumnName) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge}
                                                </TableCell>
                                            );
                                        } else if (
                                            col.name === props.avgColumnName1
                                        ) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge1}
                                                </TableCell>
                                            );
                                        } else if (
                                            col.name === props.avgColumnName2
                                        ) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge2}
                                                </TableCell>
                                            );
                                        } else if (
                                            col.name === props.avgColumnName3
                                        ) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge3}
                                                </TableCell>
                                            );
                                        } else {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                />
                                            );
                                        }
                                    }


                                    return null;
                                })}
                            </TableRow>
                        </>
                    )}
                </TableFooter>
            );
        },

        setTableProps: () => {
            return {
                padding: "normal",
                size: "small",
            };
        },

        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <>
                <CustomToolbarSelect
                    selectedRows={selectedRows}
                    btnDeleteClick={props.btnDelete}
                    modelType={props.modelType}
                    dataTargetID={props.editdataTargetID}
                    btnEditClick={props.btnEdit}
                    btnHumanClick={props.btnHuman}
                    isHideHuman={props.isHideHuman}
                    isHideDelete={props.isHideDelete}
                    isHideEdit={props.isHideEdit}
                    isUnitApproveButton={props.isUnitApproveButton}
                    showArchive={props.showArchive} // 🔥 ЭНЭ
                    btnArchiveClick={props.btnArchiveClick} // 🔥 ЭНЭ
                />
            </>
        ),
        // onRowsDelete: (rowsDeleted, newData) => {
        //     console.log("rowsDeleted");
        //     console.dir(rowsDeleted);
        //     console.dir(newData);
        //     if (
        //         rowsDeleted &&
        //         rowsDeleted.data &&
        //         rowsDeleted.data[0] &&
        //         rowsDeleted.data[0].dataIndex === -1
        //     ) {
        //         window.alert("Can't delete this!");
        //         return false;
        //     }
        //     props.setdata(newData);
        //     console.log(rowsDeleted, "were deleted!");
        // },
        setRowProps: (row, dataIndex, rowIndex) => {
            return {
                className: clsx({
                    // [classes.BusinessAnalystRow]: row[1] === "Business Analyst",
                    [classes.GreyLine]:
                        rowIndex % 2 === 0 && row[1] !== "Business Analyst",
                }),
                // style: { border: "1px solid gray" },
            };
        },

        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
            props.setRowsSelected(rowsSelected);
            // props.setRowSelectedIndex(rowsSelectedData[0].index);
        },
        ...(props.customRowRender && { customRowRender: props.customRowRender }),
    };
    const optionsWithServerSide = {
        textLabels: {
            body: {
                noMatch: "Өгөгдөл байхгүй байна...",
            },
            filter: {
                all: "Сонгоно уу",
                title: "ХАЙЛТЫН ХЭСЭГ",
                reset: "ДАХИН ТОХИРУУЛАХ",
            },
            toolbar: {
                search: "Хайх",
                print: "Хэвлэх",
                viewColumns: "Харах баганууд",
                filterTable: "Хайлтын хэсэг",
            },
            pagination: {
                next: "Following page",
                previous: "Preceding page",
                rowsPerPage: "Харах тоо:",
                displayRows: "of",
                jumpToPage: "Хуудас үсрэх",
            },
        },

        resizableColumns: true,
        download: false,
        filterType: "dropdown",
        selectableRows: "single",
        selectableRowsOnClick: true,
        selectToolbarPlacement: "replace",
        jumpToPage: true,
        rowsSelected: props.getRowsSelected,

        // server side
        serverSide: true,
        count: props.count,
        page: props.page,
        rowsPerPage: props.rowsPerPage,
        onTableChange: (action, tableState) => {
            // if (action === "changePage") {
            //     props.setPage(tableState.page);
            // } else if (action === "changeRowsPerPage") {
            //     props.setRowsPerPage(tableState.rowsPerPage);
            //     props.setPage(0); // Reset to first page when rows per page change
            // }
            if (action === "changePage") {
                props.setPage(tableState.page);
            } else if (action === "changeRowsPerPage") {
                props.setRowsPerPage(tableState.rowsPerPage);
                props.setPage(0); // Reset to first page when rows per page change
            } else if (action === "search") {
                props.setSearchText(tableState.searchText);
                props.setPage(0); // Reset to first page on search
            }
        },
        // server side

        customTableBodyFooterRender: function (opts) {
            let isFooter = false;

            if (props.avgColumnIndex != -1) {
                isFooter = true;
            }
            // let avgAge =
            //     opts.data.reduce((accu, item) => {
            //         return accu + item.data[props.avgColumnIndex];
            //     }, 0) / opts.data.length;
            // avgAge = Math.round(avgAge);

            let avgAge = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex];
            }, 0);
            avgAge = Math.round(avgAge);

            let avgAge1 = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex1];
            }, 0);

            avgAge1 = Math.round(avgAge1);

            let avgAge2 = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex2];
            }, 0);

            avgAge2 = Math.round(avgAge2);

            let avgAge3 = opts.data.reduce((accu, item) => {
                return accu + item.data[props.avgColumnIndex3];
            }, 0);

            avgAge3 = Math.round(avgAge3);

            return (
                <TableFooter className={footerClasses}>
                    {isFooter && (
                        <>
                            <TableRow>
                                {opts.selectableRows !== "none" ? (
                                    <TableCell className={footerClasses} />
                                ) : null}
                                {opts.columns.map((col, index) => {
                                    if (col.display === "true") {
                                        if (col.name === props.avgColumnName) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge}
                                                </TableCell>
                                            );
                                        } else if (
                                            col.name === props.avgColumnName1
                                        ) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge1}
                                                </TableCell>
                                            );
                                        } else if (
                                            col.name === props.avgColumnName2
                                        ) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge2}
                                                </TableCell>
                                            );
                                        } else if (
                                            col.name === props.avgColumnName3
                                        ) {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                >
                                                    {props.avgName} {avgAge3}
                                                </TableCell>
                                            );
                                        } else {
                                            return (
                                                <TableCell
                                                    key={index}
                                                    className={footerClasses}
                                                />
                                            );
                                        }
                                    }

                                    {
                                        /* <TableCell
                                                key={index}
                                                className={footerClasses}
                                            >
                                                {props.avgName1} {avgAge1}
                                            </TableCell> */
                                    }

                                    {
                                        /* <TableCell
                                                key={index}
                                                className={footerClasses}
                                            >
                                                {props.avgName2} {avgAge2}
                                            </TableCell>

                                            <TableCell
                                                key={index}
                                                className={footerClasses}
                                            >
                                                {props.avgName3} {avgAge3}
                                            </TableCell> */
                                    }

                                    // if (col.display === "true") {
                                    //     if (col.name === props.avgColumnName1 ) {
                                    //         return (
                                    //             <>

                                    //             </>
                                    //         );
                                    //     } else {
                                    //         return (
                                    //             <TableCell
                                    //                 key={index}
                                    //                 className={footerClasses}
                                    //             />
                                    //         );
                                    //     }
                                    // }

                                    return null;
                                })}
                            </TableRow>
                        </>
                    )}
                </TableFooter>
            );
        },

        setTableProps: () => {
            return {
                padding: "normal",
                size: "small",
            };
        },

        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <>
                <CustomToolbarSelect
                    selectedRows={selectedRows}
                    btnDeleteClick={props.btnDelete}
                    modelType={props.modelType}
                    dataTargetID={props.editdataTargetID}
                    btnEditClick={props.btnEdit}
                    btnHumanClick={props.btnHuman}
                    isHideHuman={props.isHideHuman}
                    isHideDelete={props.isHideDelete}
                    isHideEdit={props.isHideEdit}
                    isUnitApproveButton={props.isUnitApproveButton}
                    btnArchiveClick={props.showArchive}
                />
            </>
        ),
        // onRowsDelete: (rowsDeleted, newData) => {
        //     console.log("rowsDeleted");
        //     console.dir(rowsDeleted);
        //     console.dir(newData);
        //     if (
        //         rowsDeleted &&
        //         rowsDeleted.data &&
        //         rowsDeleted.data[0] &&
        //         rowsDeleted.data[0].dataIndex === -1
        //     ) {
        //         window.alert("Can't delete this!");
        //         return false;
        //     }
        //     props.setdata(newData);
        //     console.log(rowsDeleted, "were deleted!");
        // },
        setRowProps: (row, dataIndex, rowIndex) => {
            return {
                className: clsx({
                    // [classes.BusinessAnalystRow]: row[1] === "Business Analyst",
                    [classes.GreyLine]:
                        rowIndex % 2 === 0 && row[1] !== "Business Analyst",
                }),
                // style: { border: "1px solid gray" },
            };
        },

        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
            props.setRowsSelected(rowsSelected);
            // props.setRowSelectedIndex(rowsSelectedData[0].index);
        },
        ...(props.customRowRender && { customRowRender: props.customRowRender }),
    };

  const getMuiTheme = createTheme({
  components: {
    /* ===== Card container ===== */
    MUIDataTable: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        },
      },
    },

    /* ===== Toolbar ===== */
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          minHeight: 56,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },

    /* ===== Header ===== */
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#f8fafc",
          fontWeight: 600,
          fontSize: 13,
          color: "#475569",
          borderBottom: "none",
          paddingTop: 12,
          paddingBottom: 12,
        },

        body: {
          fontSize: 14,
          color: "#1e293b",

          /* 🔥 lighter separators */
          borderBottom: "1px solid #e2e8f0",

          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },

    /* ===== Rows ===== */
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "all 0.12s ease",

          /* very soft zebra */
          "&:nth-of-type(even)": {
            backgroundColor: "#fcfdff",
          },

          /* modern hover */
          "&:hover": {
            backgroundColor: "#f3f6fb",
          },
        },
      },
    },

    /* ===== Footer ===== */
    MuiTableFooter: {
      styleOverrides: {
        root: {
          background: "#f8fafc",
          borderTop: "none",
          fontWeight: 600,
        },
      },
    },

    /* ===== Pagination ===== */
    MUIDataTablePagination: {
      styleOverrides: {
        toolbar: {
          background: "#ffffff",
          borderTop: "none",
          minHeight: 52,
        },
      },
    },

    /* ===== Icons softer ===== */
    MUIDataTableToolbar: {
      styleOverrides: {
        icon: {
          color: "#94a3b8",
        },
      },
    },
  },
});



    return (
        <>
            <ThemeProvider theme={getMuiTheme}>
                <MUIDataTable
                    title={props.costumToolbar}
                    data={props.data}
                    columns={props.columns}
                    options={
                        props.isServerSide ? optionsWithServerSide : options
                    }

                />
            </ThemeProvider>
        </>
    );
};

export default withStyles(MUIDatatable, customStyles);
// export default MUIDatatable;
