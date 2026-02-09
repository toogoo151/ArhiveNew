import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import axios from "../../../AxiosUser";

import AsideMenu from "../../../components/Admin/layouts/asideMenu/AsideMenu";
import Content from "../../../components/Admin/layouts/content/Content";
import Footer from "../../../components/Admin/layouts/footer/Footer";
import HeaderMenu from "../../../components/Admin/layouts/headerMenu/HeaderMenu";

import { AppContext } from "../../../Context/MyContext";

function App() {
    const [getUserDataRow, setUserDataRow] = useState(null);

    useEffect(() => {
        axios
            .get("/get/auth")
            .then((res) => {
                setUserDataRow(res.data);
                // localStorage.setItem("userID", res.data.userID);
                localStorage.setItem("hereglegch_ner", res.data.hereglegch_ner);
                localStorage.setItem("userType", res.data.user_type);
            })
            .catch((err) => {
                if (err.response && err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            });
    }, []);

    return (
        <div>
            <BrowserRouter>
                <AppContext.Provider value={{ getUserDataRow }}>
                    <AsideMenu />
                    <HeaderMenu />
                    <Content />

                    <Footer />
                </AppContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;

if (document.getElementById("body-content")) {
    const container = document.getElementById("body-content");
    const root = createRoot(container);
    root.render(<App />);
}
