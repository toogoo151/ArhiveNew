import React from "react";
import { Link } from "react-router-dom";

export default function AshiglahZaavar(props) {
    return (
        <li className="nav-item">
            <Link to={props.url} className="nav-link" target={"_blank"}>
                <i className={props.icon} />
                {props.menuName}
            </Link>
        </li>
    );
}
