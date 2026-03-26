import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { withStyles } from "tss-react/mui";
import MUIButtonShowModel from "../ButtonShowModel/MUIButtonShowModel";
const defaultToolbarSelectStyles = {
    iconButton: {},
    iconContainer: {
        marginRight: "24px",
        // float: "left",
    },
    inverseIcon: {
        transform: "rotate(90deg)",
    },
};

class CustomToolbarSelect extends React.Component {
    constructor(props) {
        super(props);
    }
    insideBtnDelete = () => {
        // console.log(this.props.rowsSelected);
        // this.props.rowsSelected = [];
        this.props.btnDeleteClick(this.props.selectedRows);
    };
    insideBtnEdit = () => {
        this.props.btnEdit(this.props.selectedRows);
    };

    render() {
        const { classes } = this.props;
        console.log("showArchive =", this.props.showArchive);

        return (
            <div className={classes.iconContainer}>
                {this.props.isHideEdit && (
                    <Tooltip title={"Засах"}>
                        <>
                            <MUIButtonShowModel
                                style={{ marginRight: 10 }}
                                dataTargetID={this.props.dataTargetID}
                                btnClassName={"btn btn-warning"}
                                modelType={this.props.modelType}
                                spanIconClassName={"fas fa-solid fa-pen"}
                                buttonName={"Засах"}
                                clickHeaderOpenModal={this.props.btnEditClick}
                            />
                        </>
                    </Tooltip>
                )}
                {this.props.isHideDelete && (
                    <Tooltip title={"Устгах"}>
                        <>
                            {/* <IconButton
                            className={classes.iconButton}
                            onClick={this.insideBtnDelete}
                        >
                            <TrashButton
                                className={classes.icon}
                                style={{ color: "#1F618D" }}
                            />
                        </IconButton> */}
                            <MUIButtonShowModel
                                btnClassName={"btn btn-danger"}
                                spanIconClassName={"fas fa-solid fa-trash"}
                                buttonName={"Устгах"}
                                clickHeaderOpenModal={this.props.btnDeleteClick}
                            />
                        </>
                    </Tooltip>
                )}
                {/* {this.props.showArchive === true && (
                    <Tooltip title={"Архивт шилжүүлэх"}>
                        <MUIButtonShowModel
                            style={{ marginLeft: 10 }}
                            btnClassName="btn btn-info"
                            spanIconClassName="fas fa-solid fa-archive"
                            buttonName="АРХИВ ШИЛЖҮҮЛЭХ"
                            clickHeaderOpenModal={this.props.btnArchiveClick}
                            disabled={!this.props.clickedRowData}
                        />
                    </Tooltip>
                )} */}
                {this.props.showArchive === true && (
                    <Tooltip title={"Архивт шилжүүлэх"}>
                        <MUIButtonShowModel
                            style={{ marginLeft: 10 }}
                            btnClassName="btn btn-info"
                            spanIconClassName="fas fa-solid fa-archive"
                            buttonName="Архив шилжүүлэх"
                            clickHeaderOpenModal={this.props.btnArchiveClick}
                        />
                    </Tooltip>
                )}
                {this.props.isHideHuman && (
                    <Tooltip title={"Хүний нөөцөд"}>
                        <>
                            <MUIButtonShowModel
                                style={{ marginLeft: 10 }}
                                btnClassName={"btn btn-info"}
                                spanIconClassName={"fas fa-solid fa-pen"}
                                buttonName={
                                    "Өөр анги, байгууллага руу шилжүүлэх"
                                }
                                clickHeaderOpenModal={this.props.btnHumanClick}
                            />
                        </>
                    </Tooltip>
                )}
                {this.props.isUnitApproveButton && (
                    <Tooltip title={"Засах"}>
                        <>
                            {/* <IconButton
                    className={classes.iconButton}
                    onClick={this.insideBtnEdit}
                >
                    <EditButton
                        className={classes.icon}
                        style={{ color: "#1F618D" }}
                    />
                </IconButton> */}
                            <MUIButtonShowModel
                                style={{ marginRight: 10 }}
                                dataTargetID={this.props.dataTargetID}
                                btnClassName={"btn btn-warning"}
                                modelType={this.props.modelType}
                                spanIconClassName={"fas fa-solid fa-pen"}
                                buttonName={
                                    "Ангийн захирагчийн шийдвэр, биеийн зохистой харьцаа оруулах"
                                }
                                clickHeaderOpenModal={this.props.btnEditClick}
                            />
                        </>
                    </Tooltip>
                )}
            </div>
        );
    }
}

export default withStyles(CustomToolbarSelect, defaultToolbarSelectStyles, {
    name: "CustomToolbarSelect",
});
