import React, { useState, useEffect } from "react";
import ButtonShowModel from "../general/ButtonShowModel/ButtonShowModel";
import axios from "../../../AxiosUser";
import AlertSuccess from "../general/Alert/AlertSuccess";
import AlertError from "../general/Alert/AlertError";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import $ from "jquery";

const AdminEdit = (props) => {
    const [sendMsg, setsendMsg] = useState("");
    const [sendMsgErr, setsendMsgErr] = useState("");
    const [changeModalType, setchangeModalType] = useState(null);
    const [modalShow, setmodalShow] = useState(false);
    const [getUserId, setgetUserId] = useState("");
    const [getUserName, setgetUserName] = useState("");
    const [getUserEmail, setgetUserEmail] = useState("");
    const [getUserType, setgetUserType] = useState("");
    const [headerID, setheaderID] = useState(0);
    const [unitId, setUnitId] = useState(0);

    const onChangeUserName = (e) => {
        setgetUserName(e.target.value);
    };
    const onChangeUserEmail = (e) => {
        setgetUserEmail(e.target.value);
    };
    const onChangeUserType = (e) => {
        if (e.target.value === "super" || e.target.value === "super2") {
            setheaderID(0);
            setUnitId(0);
        }
        setgetUserType(e.target.value);
    };
    const onChangeUserPermission = (e) => {
        setUnitId(0);
        setheaderID(e.target.value);
    };
    const selectedUnit = (e) => {
        setheaderID(0);
        setUnitId(e.target.value);
    };

    const clickHeaderMenuEditBtn = () => {
        // setTimeout(function () {
        //     $("#adminEditModul").modal("hide");
        // }, 5000);
        if (getUserName && getUserEmail && getUserType) {
            axios
                .post("/update/admin", {
                    _token: document.querySelector('meta[name="csrf-token"]')
                        .content,
                    id: getUserId,
                    name: getUserName,
                    email: getUserEmail,
                    user_type: getUserType,
                    permission: headerID,
                    unit: unitId,
                })
                .then((response) => {
                    // console.log(response.data);
                    setsendMsg(response.data.msg);
                    // setgetUserId("");
                    // setgetUserName("");
                    // setgetUserEmail("");
                    // setgetUserType("");
                    // setheaderID("");
                    // setUnitId("");
                    // props.reloadDataTable();
                    window.location.reload();
                })
                .catch((err) => {
                    if (err.response.status == 401) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                    setsendMsgErr(err.response.data.msg);
                    // console.log(err);
                });
        } else {
            Swal.fire("Аль нэг талбар хоосон байна");
        }
    };
    const clickHandlerEditBtn = () => {
        if (props.getDataRowLenght === 1) {
            props.changeDataRow.map(
                (item) => (
                    setgetUserId(item.id),
                    setgetUserName(item.name),
                    setgetUserEmail(item.email),
                    setgetUserType(item.user_type),
                    setheaderID(item.permission),
                    setUnitId(item.userUnit)
                )
            );
            setchangeModalType("modal");
        } else {
            if (props.getDataRowLenght === "" || props.getDataRowLenght === 0) {
                Swal.fire("Та засах хэрэглэгч сонгоно уу!!!");
                setchangeModalType("");
                return;
            }
            if (props.getDataRowLenght > 1) {
                Swal.fire("Та 1 хэрэглэгч сонгоно уу!!!");
                setchangeModalType("");
                return;
            }
        }
    };

    return (
        <>
            <ButtonShowModel
                btnClassName={"btn btn-warning"}
                modelType={changeModalType}
                dataTargetID={"#adminEditModul"}
                spanIconClassName={"fas fa-solid fa-pen-square"}
                buttonName={"Засах"}
                clickHeaderOpenModal={clickHandlerEditBtn}
            />
            <div className="modal" id="adminEditModul">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">Хэрэглэгч засах</h4>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            >
                                ×
                            </button>
                        </div>
                        {/* Modal body */}
                        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-3 float-righ">
                                    <label className="float-righ">Нэр:</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                @
                                            </span>
                                        </div>
                                        <input
                                            onChange={onChangeUserName}
                                            type="text"
                                            className="form-control"
                                            placeholder="Нэр..."
                                            value={getUserName}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 float-righ">
                                    <label className="float-righ">
                                        Цахим хаяг:
                                    </label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="fas fa-envelope"></i>
                                            </span>
                                        </div>
                                        <input
                                            onChange={onChangeUserEmail}
                                            type="Email"
                                            id="userEmail"
                                            className="form-control"
                                            placeholder="Цахим хаяг..."
                                            value={getUserEmail}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3 float-righ">
                                    <label>Хэрэглэгчийн эрх:</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="fas fa-check"></i>
                                            </span>
                                        </div>
                                        <select
                                            className="form-control"
                                            id="permission"
                                            value={getUserType}
                                            onChange={onChangeUserType}
                                        >
                                            <option value="">Сонгоно уу</option>
                                            <option value="super">
                                                Super admin
                                            </option>
                                            <option value="super2">
                                                Super admin 2
                                            </option>
                                            <option value="user">admin</option>
                                            <option value="unit">unit</option>
                                            <option value="userSolder">
                                                user
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {getUserType == "super" && ""}
                            {getUserType == "user" && (
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label>Цэс оруулах эрх:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            </div>
                                            <select
                                                className="form-control"
                                                value={headerID}
                                                onChange={
                                                    onChangeUserPermission
                                                }
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {props.getHeaderMenu.map(
                                                    (item) => (
                                                        <option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {
                                                                item.header_menu_name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {getUserType == "unit" && (
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label>Анги сонгох:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            </div>
                                            <select
                                                onChange={selectedUnit}
                                                value={unitId}
                                                className="form-control"
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {props.getUnits.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {getUserType == "userSolder" && (
                                <div className="row">
                                    <div className="col-md-3 float-righ">
                                        <label>Анги сонгох:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            </div>
                                            <select
                                                onChange={selectedUnit}
                                                value={unitId}
                                                className="form-control"
                                            >
                                                <option value="0">
                                                    Сонгоно уу
                                                </option>
                                                {props.getUnits.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {sendMsg && <AlertSuccess msg={sendMsg} />}
                            {sendMsgErr && <AlertError msg={sendMsgErr} />}
                        </div>
                        {/* Modal footer */}
                        <div className="modal-footer">
                            {getUserType == "super" &&
                                headerID == 0 &&
                                unitId == 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        data-dismiss=""
                                        onClick={clickHeaderMenuEditBtn}
                                    >
                                        Засах
                                    </button>
                                )}
                            {getUserType == "super2" &&
                                headerID == 0 &&
                                unitId == 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        data-dismiss=""
                                        onClick={clickHeaderMenuEditBtn}
                                    >
                                        Засах
                                    </button>
                                )}
                            {getUserType == "user" &&
                                headerID != 0 &&
                                unitId == 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        data-dismiss=""
                                        onClick={clickHeaderMenuEditBtn}
                                    >
                                        Засах
                                    </button>
                                )}
                            {getUserType == "unit" &&
                                headerID == 0 &&
                                unitId != 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        data-dismiss=""
                                        onClick={clickHeaderMenuEditBtn}
                                    >
                                        Засах
                                    </button>
                                )}
                            {getUserType == "userSolder" &&
                                headerID == 0 &&
                                unitId != 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        data-dismiss=""
                                        onClick={clickHeaderMenuEditBtn}
                                    >
                                        Засах
                                    </button>
                                )}
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                            >
                                Хаах
                            </button>
                        </div>
                        {/* </form> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminEdit;
