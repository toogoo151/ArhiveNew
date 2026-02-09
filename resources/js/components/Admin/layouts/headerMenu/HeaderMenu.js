import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import axios from "../../../../AxiosUser";
import { AppContext } from "../../../../Context/MyContext";

// import Notification from "../../../../../img/1.svg";
// import NotifyMe from "react-notification-timeline";

import "./navbar.css";

export default function HeaderMenu(props) {
    const state = useContext(AppContext);
    const [getRows, setRows] = useState([]);
    const [loadData, setData] = useState([]);
    const [getName, setFirstName] = useState("");

    const [getTime, setTime] = useState("");
    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Get userType from localStorage or from state
    let userType =
        localStorage.getItem("userType") ||
        (state.getUserDataRow && state.getUserDataRow.user_type) ||
        "";

    const getLatestRowDetails = async () => {
        const results = await axios.get("/getLatestRow");
        setRows(results.data);
    };

    useEffect(() => {
        axios
            .get("/get/auth/name")
            .then((res) => {
                setFirstName(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Ulaanbaatar timezone offset (UTC+8)
            const options = {
                timeZone: "Asia/Ulaanbaatar",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            };
            const timeString = now.toLocaleTimeString("en-GB", options);
            setTime(timeString);
        };

        updateTime(); // set immediately
        const interval = setInterval(updateTime, 1000); // update every second

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    const logout = () => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        userType = "";
        localStorage.clear();
        axios
            .post("/logout", {
                _token: csrfToken,
            })
            .then((response) => {
                console.log(response.data);
                userType = "";
                window.location = "/home";
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status == 401) {
                    localStorage.clear();
                    userType = "";
                    window.location.href = "/login";
                }
            });
    };

    return (
      <nav className="main-header navbar navbar-expand">
    {/* LEFT */}
    <ul className="navbar-nav">
        <li className="nav-item">
            <a
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
            >
                <i className="fa fa-bars" />
            </a>
        </li>
    </ul>

    {/* RIGHT */}
    <ul className="navbar-nav ml-auto align-items-center">

        {/* clock */}
        <li className="nav-item navbar-time">
            🕒 {getTime} (MN)
        </li>

        {/* user */}
        <li className="nav-item dropdown">
            <button
                className="user-btn"
                data-toggle="dropdown"
            >
                <span className="user-avatar">
                    {capitalizeFirstLetter(getName?.trim()[0] || "")}
                </span>

                <span>
                    {capitalizeFirstLetter(getName?.trim() || "")}
                </span>

                <i className="fa fa-angle-down" />
            </button>

            <div className="dropdown-menu dropdown-menu-right">
                <Link
                    to="/login"
                    onClick={logout}
                    className="dropdown-item"
                >
                    <i className="fa fa-sign-out-alt mr-2 "></i>
                    <strong>Гарах</strong>
                </Link>
            </div>
        </li>
    </ul>
</nav>
    );
}
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

if (document.getElementById("headerMenu")) {
    ReactDOM.render(<HeaderMenu />, document.getElementById("headerMenu"));
}
{
}
