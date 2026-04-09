import { useLocation, useNavigate } from "react-router-dom";
import "./lavlagaaTabs.css";

/**
 * Switches between /get/lavlagaa-info and /get/huselt-info (separate route entries).
 */
const LavlagaaHuseltTabs = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const activeTab = pathname.includes("huselt-info") ? "huselt" : "lavlagaa";

    return (
        <div className="labelWrapper">
            <div className={`tab-indicator ${activeTab}`} />
            <button
                type="button"
                className={`labelBtn ${activeTab === "huselt" ? "active" : ""}`}
                onClick={() => navigate("/get/huselt-info")}
            >
                📂 Хүсэлт
            </button>
            <button
                type="button"
                className={`labelBtn ${
                    activeTab === "lavlagaa" ? "active" : ""
                }`}
                onClick={() => navigate("/get/lavlagaa-info")}
            >
                📊 Лавлагаа
            </button>
        </div>
    );
};

export default LavlagaaHuseltTabs;
