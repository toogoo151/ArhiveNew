import React, { useState, useEffect } from "react";
import ButtonShowModel from "../general/ButtonShowModel/ButtonShowModel";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";
const AdminDelete = (props) => {
    const [userId, setuserId] = useState(null);
    const adminDeleteBtn = () => {
        if (props.allDataRowLenght >= 1) {
            Swal.fire({
                title:
                    "та " +
                    props.allDataRowLenght +
                    " хэрэглэгч устгахдаа итгэлтэй байна уу?",
                // showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: `Тийм`,
                cancelButtonText: `Үгүй`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .post("/delete/admin", {
                            _token: document.querySelector(
                                'meta[name="csrf-token"]'
                            ).content,
                            ids: props.allDataRow,
                        })
                        .then((response) => {
                            console.log(response.data.msg);
                            Swal.fire(response.data.msg);
                            // setsendMsg(response.data);
                            props.reloadDataTable();
                            resetState();

                            // return;
                        })
                        .catch((err) => {
                            if (err.response.status == 401) {
                                localStorage.clear();
                                window.location.href = "/login";
                            }
                            Swal.fire(err.response.data.msg);
                            // setsendMsgErr(err.response.data.msg);
                            // console.log(err.data);
                        });
                } else if (result.isDenied) {
                    // Swal.fire("Changes are not saved", "", "info");
                }
            });
        } else {
            Swal.fire("Утгах хэрэглэгч сонгоно уу");
        }
    };
    return (
        <ButtonShowModel
            btnClassName={"btn btn-danger"}
            modelType={"modal"}
            dataTargetID={"#adminDeleteModul"}
            spanIconClassName={"fas fa-solid fa-trash"}
            buttonName={"Устгах"}
            clickHeaderOpenModal={adminDeleteBtn}
        />
    );
};

export default AdminDelete;
