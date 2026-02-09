import React from "react";
import { Link } from "react-router-dom";

export default function MenuItem(props) {
    return (
        <li className="nav-item">
            <Link
                to={props.url}
                className="nav-link"
                style={{ 
                    color: "#E8E8E8",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    margin: "2px 5px",
                    transition: "all 0.3s ease",
                    display: "block"
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "rgba(102, 126, 234, 0.2)";
                    e.target.style.color = "#FFFFFF";
                    e.target.style.transform = "translateX(5px)";
                    e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#E8E8E8";
                    e.target.style.transform = "translateX(0)";
                    e.target.style.boxShadow = "none";
                }}
            >
                <i className={props.icon} style={{ marginRight: "8px" }} />
                {props.menuName}
            </Link>
        </li>
    );
}
