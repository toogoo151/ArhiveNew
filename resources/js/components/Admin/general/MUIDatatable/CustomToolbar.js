import ExcelIcon from "@mui/icons-material/CloudDownload";
import { Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { CSVLink } from "react-csv";
import { withStyles } from "tss-react/mui";
import MUIButtonShowModel from "../ButtonShowModel/MUIButtonShowModel";
const defaultToolbarStyles = {
    iconButton: {},
};

class CustomToolbar extends React.Component {
    constructor(props, ref) {
        super(props);
    }

    renderCsvDataDriver() {
        if (this.props.isOfficerDriverExcelHeaders) {
            return this.props.excelDownloadDriverData.map((item) => ({
                unitShortName: item.unitShortName,
                lastName: item.lastName,
                firstName: item.firstName,
                score: item.score,
                scoreApprove:
                    item.scoreApprove === 0
                        ? "Хоосон"
                        : item.scoreApprove === 1
                        ? "Тэнцсэн"
                        : "Тэнцээгүй",
                practice:
                    item.practice === 0
                        ? "Хоосон"
                        : item.practice === 1
                        ? "Тэнцсэн"
                        : "Тэнцээгүй",
                Finally:
                    item.Finally === 0
                        ? "Хоосон"
                        : item.Finally === 1
                        ? "Тэнцсэн"
                        : "Тэнцээгүй",
            }));
        }
    }
    renderCsvData() {
        if (this.props.isOfficerMainExcelHeaders) {
            return this.props.excelDownloadData.map((item) => ({
                missionName: item.missionName,
                eeljName: item.eeljName,
                comandlalShortName: item.comandlalShortName,

                unitShortName: item.unitShortName,
                shortRank: item.shortRank,
                rd: item.rd,
                lastName: item.lastName,
                firstName: item.firstName,
                age: item.age,
                genderName: item.genderName,
                documentsMainApprove:
                    item.documentsMainApprove === 0
                        ? "Шийдвэрлээгүй"
                        : item.documentsMainApprove === 1
                        ? "Зөвшөөрөгдсөн"
                        : "Татгалзсан",
                healthApprove:
                    item.healthApprove === 0
                        ? "Ороогүй"
                        : item.healthApprove === 1
                        ? "Тэнцсэн"
                        : "Тэнцээгүй",
                alcpt_score:
                    item.alcpt_score === 0 ? "Өгөөгүй" : item.alcpt_score,
                sportScore:
                    item.languageScore === 0.0 ? "Өгөөгүй" : item.languageScore,
                sportScore: item.sportScore === 0 ? "Өгөөгүй" : item.sportScore,

                driverApprove:
                    item.driverApprove === 0
                        ? "Өгөөгүй"
                        : item.driverApprove === 1
                        ? "Тэнцсэн"
                        : "Тэнцээгүй",

                skillScore: item.skillScore === 0 ? "Өгөөгүй" : item.skillScore,
            }));
        }
    }

    render() {
        const csvData = this.renderCsvData();
        const csvData2 = this.renderCsvDataDriver();

        return (
            <div className="row">
                {this.props.isHideInsert && (
                    <div className="col-md-2 col-ms-6">
                        <React.Fragment>
                            <Tooltip title={"custom icon"}>
                                <>
                                    <MUIButtonShowModel
                                        btnClassName={this.props.btnClassName}
                                        modelType={this.props.modelType}
                                        dataTargetID={this.props.dataTargetID}
                                        spanIconClassName={
                                            this.props.spanIconClassName
                                        }
                                        buttonName={this.props.buttonName}
                                        clickHeaderOpenModal={
                                            this.props.btnInsert
                                        }
                                    />
                                </>
                            </Tooltip>
                        </React.Fragment>
                    </div>
                )}
                <div
                    className="col-md-1 col-ms-6 text-left"
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                    }}
                >
                    <CSVLink
                        data={
                            this.props.isOfficerMainExcelHeaders
                                ? csvData
                                : this.props.isOfficerDriverExcelHeaders
                                ? csvData2
                                : this.props.excelDownloadData
                        }
                        headers={this.props.excelHeaders}
                        title="Excel файл татах"
                    >
                        <ExcelIcon
                            style={{
                                color: "white",
                                width: 40,
                                height: 40,
                            }}
                        ></ExcelIcon>
                    </CSVLink>
                </div>
                {/* Header title shuuu */}
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
