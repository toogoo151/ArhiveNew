import React, { useState, useEffect } from "react";
import axios from "../../../AxiosUser";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import DadaModal from "../general/dadaModal/DadaModal";

const data = {
    label: "search me",
    value: "searchme",
    children: [
        {
            label: "search me too",
            value: "searchmetoo",
            children: [
                {
                    label: "No one can get me",
                    value: "anonymous",
                },
            ],
        },
    ],
};

export default function SideMenuContentNew(props) {
    const [sideMenus, setSideMenus] = useState([]);
    const [headerMenuID, setHeaderMenuID] = useState("-1");
    const [sideMenuID, setSideMenuID] = useState("-1");
    const [sideMenuName, setSideMenuName] = useState("");

    useEffect(() => {}, []);

    const changeHeaderMenu = (e) => {
        setHeaderMenuID(e.target.value);
        axios
            .get(`/get/side/menu/tree/${e.target.value}`, data)
            .then((res) => {
                setSideMenus(res.data);
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                console.log(err);
            });
    };

    const clickSave = () => {
        alert("A");
        if (headerMenuID === "-1" || headerMenuID === "") {
            alert("Толгой цэсээ сонгоно уу!!!");
            return;
        }
        if (sideMenuID === "-1") {
            alert("Хажуугийн цэсээ сонгоно уу!!!");
            return;
        }
        if (sideMenuName === "") {
            alert("цэсийн нэрээ оруулна уу!!!");
            return;
        }

        axios
            .post("/side/menu/new", {
                _token: document.querySelector('meta[name="csrf-token"]')
                    .content,
                header_menu_id: headerMenuID,
                parent_id: sideMenuID,
                side_menu_name: sideMenuName,
            })
            .then((res) => {
                if (res.data.status === "success") {
                    alert(res.data.msg);
                }
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                alert("Алдаа гарлаа админд хандана уу!!!");
            });
    };

    const onChange = (currentNode, selectedNodes) => {
        setSideMenuID(currentNode.value);
        console.log("onChange::", currentNode.value, selectedNodes);
    };

    const onChangeMenuName = (e) => {
        setSideMenuName(e.target.value);
    };
    const onAction = (node, action) => {
        console.log("onAction::", action, node);
    };
    const onNodeToggle = (currentNode) => {
        console.log("onNodeToggle::", currentNode);
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-success"
                data-toggle="modal"
                data-target="#sideMenuNew"
            >
                <span className="fas fa-solid fa-plus"></span>
                &nbsp; Нэмэх
            </button>

            <DadaModal
                modalID="sideMenuNew"
                headerText="Зүүн цэс нэмэх"
                clickEvent={clickSave}
            >
                <div className="form-group">
                    <label>Толгой цэс</label>
                    <select
                        onChange={changeHeaderMenu}
                        className="form-control"
                    >
                        <option value="-1">Сонгоно уу</option>
                        {props.headers.map((header) => (
                            <option key={header.id} value={header.id}>
                                {header.header_menu_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Хажуугийн цэс</label>
                    <DropdownTreeSelect
                        data={sideMenus}
                        onChange={onChange}
                        onAction={onAction}
                        onNodeToggle={onNodeToggle}
                    />
                </div>
                <div className="form-group">
                    <label>цэсийн нэр</label>
                    <input
                        type="text"
                        onChange={onChangeMenuName}
                        className="form-control"
                    />
                </div>
            </DadaModal>
        </div>
    );
}
