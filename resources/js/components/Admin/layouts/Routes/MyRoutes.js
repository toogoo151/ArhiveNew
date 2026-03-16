import { Navigate, Route, Routes } from "react-router-dom";

import Angi from "../../../../Pages/Archive/Angi/index";
import ArhivBIlts from "../../../../Pages/Archive/BaingaIlts/ArhivBIlts";
import BaingaIlts from "../../../../Pages/Archive/BaingaIlts/index";
import ArhivBNuuts from "../../../../Pages/Archive/BaingaNuuts/ArhivBNuuts";
import BaingaNuuts from "../../../../Pages/Archive/BaingaNuuts/index";
import Comandlal from "../../../../Pages/Archive/Comandlal/index";
import ArhivDHuns from "../../../../Pages/Archive/DalanJilHun/ArhivDhun";
import Dalanjils from "../../../../Pages/Archive/DalanJilHun/index";
import ArhivDSanhuus from "../../../../Pages/Archive/DalanJilSanhuu/ArhivDSanhuu";
import DalanjilSanhuus from "../../../../Pages/Archive/DalanJilSanhuu/index";
import DansBurtgel from "../../../../Pages/Archive/DansBurtgel/index";
import Graphic from "../../../../Pages/Archive/Graphic/Graphic";
import Statistic from "../../../../Pages/Archive/Graphic/Statistic";
import Hadgalamj from "../../../../Pages/Archive/Hadgalamj/index";
import Humrug from "../../../../Pages/Archive/Humrug/index";
import Huthereg from "../../../../Pages/Archive/Huthereg/index";
import Salbar from "../../../../Pages/Archive/Salbar/index";
import TovchilsonUg from "../../../../Pages/Archive/TovchilsonUg/index";
import User from "../../../../Pages/Archive/User/index";

// GANBAT NEMSEN TUR HADGALAH
import ArhivTRIlts from "../../../../Pages/Archive/TurIlt/ArhivTRIlts";
import TurIlt from "../../../../Pages/Archive/TurIlt/index";
import ArhivTrNuuts from "../../../../Pages/Archive/TurNuuts/ArhivTrNuuts";
import TurNuuts from "../../../../Pages/Archive/TurNuuts/index";
import HomePage from "../../../../Pages/HomePage/HomePage";

// Туслах санд нэмэх
import AshigNom from "../../../../Pages/Archive/AshigNom/index";
import JagsaaltZuil from "../../../../Pages/Archive/JagsaaltZuil/index";
import SedevZui from "../../../../Pages/Archive/SedevZui/index";
import Tovchlol from "../../../../Pages/Archive/TovchilsonUg/index";

//Nuugdah
import ProgrammType from "../../../../Pages/Archive/Tuslah/ProgrammType";
import Retention from "../../../../Pages/Archive/Tuslah/Retention";

const MyRoutes = (props) => {
    const { handleFirstMenuClick, getMissionType } = props;
    return (
        <Routes>
            {/* 👉 Root redirect */}
            <Route path="/" element={<Navigate to="/home" />} />

            <Route
                path="/home"
                element={
                    <HomePage
                        handleFirstMenuClick={handleFirstMenuClick}
                        getMissionType={getMissionType}
                    />
                }
            />

            <Route path="/get/users" element={<User />} />
            <Route path="/get/comandlals" element={<Comandlal />} />
            <Route path="/get/classes" element={<Angi />} />
            <Route path="/get/salbars" element={<Salbar />} />
            <Route path="/get/hutheregs" element={<Huthereg />} />
            <Route path="/get/statistic" element={<Statistic />} />
            <Route path="/get/graphic" element={<Graphic />} />
            <Route path="/get/hadgalamj" element={<Hadgalamj />} />
            <Route path="/get/humrugs" element={<Humrug />} />
            <Route path="/get/DansBurtgels" element={<DansBurtgel />} />
            <Route path="/get/tovchililsonUgs" element={<TovchilsonUg />} />
            <Route path="/get/BaingaIlts" element={<BaingaIlts />} />
            <Route path="/get/BaingaNuutss" element={<BaingaNuuts />} />
            <Route path="/get/ArhivBIlts" element={<ArhivBIlts />} />
            <Route path="/get/ArhivBNuutss" element={<ArhivBNuuts />} />

            <Route path="/get/Dalanjils" element={<Dalanjils />} />
            <Route path="/get/DalanjilSanhuus" element={<DalanjilSanhuus />} />
            <Route path="/get/ArhivDHuns" element={<ArhivDHuns />} />
            <Route path="/get/ArhivDSanhuus" element={<ArhivDSanhuus />} />

            {/* GANBAT NEMSEN TUR HADGALAH */}
            <Route path="/get/TurNuutss" element={<TurNuuts />} />
            <Route path="/get/turilts" element={<TurIlt />} />
            <Route path="/get/ArhivTRIlts" element={<ArhivTRIlts />} />
            <Route path="/get/ArhivTrNuutss" element={<ArhivTrNuuts />} />

            {/* Туслах санд нэмэх */}
            <Route path="/get/jagsaaltZuils" element={<JagsaaltZuil />} />
            <Route path="/get/sedevZuilzaagch" element={<SedevZui />} />
            <Route path="/get/dictonaries" element={<AshigNom />} />
            <Route path="/get/tovchilsonug" element={<Tovchlol />} />
            {/* Туслах сан дуусах*/}
            {/* Нуугдмал санд нэмэх */}
            <Route path="/get/retentions" element={<Retention />} />
            <Route path="/get/programmType" element={<ProgrammType />} />

            {/* Нуугдмал санд нэмэх */}

            {/* 404 */}
            <Route path="*" element={<h1>Хуудас олдсонгүй</h1>} />
        </Routes>
    );
};

export default MyRoutes;
