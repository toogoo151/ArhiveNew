import ExcelIcon from "@mui/icons-material/CloudDownload";
import { Typography, Tooltip } from "@mui/material";
import React from "react";
import { withStyles } from "tss-react/mui";
import * as XLSX from "xlsx-js-style";
import MUIButtonShowModel from "../ButtonShowModel/MUIButtonShowModel";

const defaultToolbarStyles = {
    iconButton: {},
};

class CustomToolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    // Convert your props data into a format suitable for XLSX
    getExcelData() {
        if (this.props.isOfficerMainExcelHeaders) {
            return this.props.excelDownloadData.map(() => ({}));
        } else if (this.props.isOfficerDriverExcelHeaders) {
            return this.props.excelDownloadDriverData.map(() => ({}));
        } else {
            return this.props.excelDownloadData;
        }
    }

    //   exportToExcel = () => {
    //     const data = this.getExcelData();
    //     const ws = XLSX.utils.json_to_sheet(data);

    //     // Customize header row style
    //     const headerRange = XLSX.utils.decode_range(ws['!ref']);
    //     for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    //       const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    //       if (!ws[cellAddress]) continue;
    //       ws[cellAddress].s = {
    //         font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    //         fill: { fgColor: { rgb: "3498DB" } }, // header background color
    //         alignment: { horizontal: "center" },
    //       };
    //     }

    //     // Optional: customize column widths
    //     ws['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));

    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    //     XLSX.writeFile(wb, "table_data.xlsx");
    //   };

    exportToExcel = () => {
        const rawData = this.getExcelData();
        const headerLabels = this.props.excelHeaders.map((h) => h.label);
        const today = new Date().toISOString().split("T")[0];
        const sheetTitle =
            (this.props.excelTitle && String(this.props.excelTitle).trim()) ||
            (this.props.title && String(this.props.title).trim()) ||
            `Архив ${today}`;
        const mappedData = rawData.map((row) => {
            const obj = {};
            this.props.excelHeaders.forEach((h) => {
                obj[h.label] = row[h.key];
            });
            return obj;
        });

        const autoWidth = (data, headers) => {
            const cols = headers.map((header, i) => {
                const maxLength = Math.max(
                    header.length,
                    ...data.map((row) =>
                        row[header] ? row[header].toString().length : 0
                    )
                );

                return { wch: maxLength + 4 }; // padding
            });

            return cols;
        };

        const ws = XLSX.utils.json_to_sheet(mappedData, {
            origin: 2,
            skipHeader: true,
        });

        // Freeze title + header
        ws["!freeze"] = { xSplit: 0, ySplit: 2 };

        // Sheet row 1: `excelTitle` (optional), else `title`, else "Архив {date}"
        XLSX.utils.sheet_add_aoa(ws, [[sheetTitle]], { origin: "A1" });

        ws["!merges"] = [
            {
                s: { r: 0, c: 0 },
                e: { r: 0, c: headerLabels.length - 1 },
            },
        ];

        // Header row
        XLSX.utils.sheet_add_aoa(ws, [headerLabels], { origin: "A2" });

        // Title style
        if (ws["A1"]) {
            ws["A1"].s = {
                font: { bold: true, sz: 18 },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true,
                },
            };
        }

        // Header styles
        const headerRange = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C });
            if (!ws[cellAddress]) continue;

            ws[cellAddress].s = {
                font: { bold: true, color: { rgb: "33333" }, sz: 12 },
                fill: { fgColor: { rgb: "D9D9D9" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "999999" } },
                    bottom: { style: "thin", color: { rgb: "999999" } },
                    left: { style: "thin", color: { rgb: "999999" } },
                    right: { style: "thin", color: { rgb: "999999" } },
                },
            };
        }

        ws["!cols"] = autoWidth(mappedData, headerLabels);
        ws["!rows"] = [
            { hpt: 30 }, // Row 1 (title)
            { hpt: 25 }, // Row 2 (header)
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, "archive-report.xlsx");
    };

    render() {
        return (
            <div className="row">
                {this.props.isHideInsert && (
                    <div className="col-md-2 col-ms-6">
                        <Tooltip title="custom icon">
                            <MUIButtonShowModel
                                btnClassName={this.props.btnClassName}
                                modelType={this.props.modelType}
                                dataTargetID={this.props.dataTargetID}
                                spanIconClassName={this.props.spanIconClassName}
                                buttonName={this.props.buttonName}
                                clickHeaderOpenModal={this.props.btnInsert}
                                disabled={this.props.isHideInsert}
                            />
                        </Tooltip>
                    </div>
                )}

                {/* Excel Export Button */}
                <div
                    className="col-md-1 col-ms-6 text-left"
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                    }}
                >
                    <Tooltip title="Export to Excel">
                        <ExcelIcon
                            style={{
                                color: "#3498db",
                                width: 40,
                                height: 40,
                                cursor: "pointer",
                            }}
                            onClick={this.exportToExcel}
                        />
                    </Tooltip>
                </div>

                {/* Header title */}
                <div
                    className="col-md-9 col-ms-7 text-left"
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {this.props.title}
                    </Typography>
                </div>
            </div>
        );
    }
}

export default withStyles(CustomToolbar, defaultToolbarStyles, {
    name: "CustomToolbar",
});
