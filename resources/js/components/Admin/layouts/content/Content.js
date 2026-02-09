import ReactDOM from "react";
import MyRoutes from "../Routes/MyRoutes";

export default function Content(props) {
    const { handleFirstMenuClick, getMissionType } = props;
    return (
        <>
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
                <section className="content">
                    <br />
                    <div className="container-fluid">
                        <MyRoutes
                            handleFirstMenuClick={handleFirstMenuClick}
                            getMissionType={getMissionType}
                        />
                    </div>
                    {/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            {/* /.content-wrapper */}
        </>
    );
}

if (document.getElementById("content")) {
    ReactDOM.render(<Content />, document.getElementById("content"));
}
