import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
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
    const openChangePassword = () => {
        Swal.fire({
            title: "🔐 Нууц үг солих",
            html: `
        <div class="swal-password-wrapper">
            <div class="swal-password-field">
                <input type="password" id="current_password" class="swal2-input" placeholder="Одоогийн нууц үг">
                <span class="hover-password" data-target="current_password">👁️</span>
            </div>

            <div class="swal-password-field">
                <input type="password" id="new_password" class="swal2-input" placeholder="Шинэ нууц үг">
                <span class="hover-password" data-target="new_password">👁️</span>
            </div>

            <div class="swal-password-field">
                <input type="password" id="new_password_confirmation" class="swal2-input" placeholder="Шинэ нууц үг давтах">
                <span class="hover-password" data-target="new_password_confirmation">👁️</span>
            </div>
        </div>
        `,
            showCancelButton: true,
            confirmButtonText: "Хадгалах",
            cancelButtonText: "Болих",
            didOpen: () => {
                document.querySelectorAll(".hover-password").forEach((icon) => {
                    const input = document.getElementById(
                        icon.getAttribute("data-target")
                    );

                    icon.addEventListener("mouseenter", () => {
                        input.type = "text";
                    });

                    icon.addEventListener("mouseleave", () => {
                        input.type = "password";
                    });
                });
            },
            preConfirm: () => {
                const current_password =
                    document.getElementById("current_password").value;
                const new_password =
                    document.getElementById("new_password").value;
                const new_password_confirmation = document.getElementById(
                    "new_password_confirmation"
                ).value;

                if (
                    !current_password ||
                    !new_password ||
                    !new_password_confirmation
                ) {
                    Swal.showValidationMessage("Бүх талбарыг бөглөнө үү");
                    return false;
                }

                if (new_password !== new_password_confirmation) {
                    Swal.showValidationMessage("Шинэ нууц үг таарахгүй байна");
                    return false;
                }

                return {
                    current_password,
                    new_password,
                    new_password_confirmation,
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post("/change-password", result.value)
                    .then(() => {
                        Swal.fire(
                            "Амжилттай",
                            "Нууц үг амжилттай солигдлоо",
                            "success"
                        );
                    })
                    .catch((error) => {
                        const res = error.response?.data;

                        let errorMsg = "Алдаа гарлаа";

                        if (res?.errors) {
                            // errors object доторх бүх мессежийг нэгтгэх
                            errorMsg = Object.values(res.errors)
                                .flat()
                                .join("\n");
                        } else if (res?.message) {
                            errorMsg = res.message;
                        }

                        Swal.fire({
                            icon: "error",
                            title: "Алдаа",
                            text: errorMsg,
                        });
                    });
            }
        });
    };

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

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
                <li className="nav-item navbar-time">🕒 {getTime} (MN)</li>

                {/* user */}
                <li className="nav-item dropdown">
                    <button className="user-btn" data-toggle="dropdown">
                        <span className="user-avatar">
                            {capitalizeFirstLetter(getName?.trim()[0] || "")}
                        </span>

                        <span>
                            {capitalizeFirstLetter(getName?.trim() || "")}
                        </span>

                        <i className="fa fa-angle-down" />
                    </button>

                    <div className="dropdown-menu dropdown-menu-right">
                        <button
                            className="dropdown-item"
                            onClick={openChangePassword}
                        >
                            <i className="fa fa-key mr-2"></i>
                            <strong>Нууц үг солих</strong>
                        </button>
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
                {showPasswordModal && (
                    <div className="password-modal-backdrop">
                        <div className="password-modal">
                            <h4>🔐 Нууц үг солих</h4>

                            <input
                                type="password"
                                placeholder="Одоогийн нууц үг"
                                value={passwordData.current_password}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        current_password: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Шинэ нууц үг"
                                value={passwordData.new_password}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        new_password: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Шинэ нууц үг давтах"
                                value={passwordData.new_password_confirmation}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        new_password_confirmation:
                                            e.target.value,
                                    })
                                }
                            />

                            <div className="modal-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={changePassword}
                                >
                                    Хадгалах
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Болих
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
