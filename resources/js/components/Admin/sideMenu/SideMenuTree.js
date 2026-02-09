import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const SideMenuTree = (props) => {
    return (
        <ul>
            {props.data.map((item) => (
                <li
                    style={{ paddingBottom: 5, paddingTop: 5 }}
                    key={item.value}
                >
                    <Link
                        className="btn btn-info"
                        key={item.value}
                        to={`/a/side/menu/edit/${item.value}`}
                    >
                        {item.label}
                    </Link>
                    {item.children?.length && (
                        <SideMenuTree data={item.children} />
                    )}
                </li>
            ))}
        </ul>
    );
};

const mapStateToProps = (state) => {
    return {
        // headers: state.SideMenuReducer.headers,
        // sideMenus: state.SideMenuReducer.sideMenus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fillSideMenuID: (headerMenuID, parentId, sideMenuId, sideMenuName) =>
            dispatch(
                actions.fillSideMenu(
                    headerMenuID,
                    parentId,
                    sideMenuId,
                    sideMenuName
                )
            ),
    };
};

export default connect(null, mapDispatchToProps)(SideMenuTree);
