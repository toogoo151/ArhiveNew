import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "../../../AxiosUser";

// 🔹 Backend-аас ирсэн өгөгдлийг массив болгон normalize хийх
const normalizeArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
};

const UserEdit = ({ changeDataRow, refreshUser, closeModal }) => {
    // Inputs
    const [hereglegch_ner, setName] = useState("");
    const [nuuts_ug, setPassword] = useState("");
    const [comand_id, setComandID] = useState("");
    const [angi, setAngi] = useState("");
    const [salbar, setSalbarID] = useState("");
    const [Progtype, setProgtypeID] = useState("");
    const [Utype, setUtypeID] = useState("");
    const [Sectype, setSectypeID] = useState("");

    const [getDataRow, setDataRow] = useState({});

    // Lists
    const [getComandlal, setComandlal] = useState([]);
    const [getUnits, setUnits] = useState([]);
    const [getSalbar, setSalbar] = useState([]);
    const [getProgtype, setProgtype] = useState([]);
    const [getUtype, setUtype] = useState([]);
    const [getSectype, setSectype] = useState([]);

    const [showPassword, setShowPassword] = useState(false);

    const salbarOptions = Array.isArray(getSalbar)
        ? getSalbar.map((u) => ({
              value: String(u.id),
              label: u.salbar ?? u.name ?? u.title ?? "",
          }))
        : [];

    // ---------------- Load lists once ----------------
    useEffect(() => {
        axios
            .get("/get/comandlal")
            .then((res) => setComandlal(normalizeArray(res)))
            .catch(() => setComandlal([]));
        axios
            .get("/get/ProgrammType")
            .then((res) => setProgtype(normalizeArray(res)))
            .catch(() => setProgtype([]));
        axios
            .get("/get/UserType")
            .then((res) => setUtype(normalizeArray(res)))
            .catch(() => setUtype([]));
        axios
            .get("/get/SecType")
            .then((res) => setSectype(normalizeArray(res)))
            .catch(() => setSectype([]));
        axios
            .get("/get/Salbar")
            .then((res) => setSalbar(normalizeArray(res)))
            .catch(() => setSalbar([]));
    }, []);

    // ---------------- When a row is selected (populate inputs) ----------------
    useEffect(() => {
        if (!changeDataRow) return;
        const row = changeDataRow;
        setDataRow(row);

        setName(row.hereglegch_ner ?? row.name ?? "");
        setPassword(""); // hashed password not shown

        setComandID(String(row.comandlalIDshuu ?? row.comand_id ?? ""));
        setAngi(String(row.unitIDshuu ?? row.angi_id ?? ""));
        setSalbarID(
            String(row.salbarIDshuu ?? row.salbar_id ?? row.salbar ?? "")
        );

        setProgtypeID(String(row.progtypeIDshuu ?? row.userType ?? ""));
        // setUtypeID(String(row.usertypeIDshuu ?? row.bichig_turul ?? ""));
        // setSectypeID(String(row.sectypeIDshuu ?? row.tubshin ?? ""));

        // Load units for the comandlal
        const actualCmd = row.comandlalIDshuu ?? row.comand_id ?? null;
        if (actualCmd) {
            axios
                .post("/get/angi/byComandlalID", { id: actualCmd })
                .then((res) => setUnits(normalizeArray(res)))
                .catch(() => setUnits([]));
        } else {
            setUnits([]);
        }
    }, [changeDataRow]);

    // ---------------- When comand changes, load units ----------------
    useEffect(() => {
        if (!comand_id) {
            setUnits([]);
            return;
        }
        axios
            .post("/get/angi/byComandlalID", { id: comand_id })
            .then((res) => setUnits(normalizeArray(res)))
            .catch(() => setUnits([]));
    }, [comand_id]);

    // ---------------- Save ----------------
    const saveUnitSub = () => {
        if (!comand_id) return Swal.fire("Командлалаа сонгоно уу.");
        if (!hereglegch_ner) return Swal.fire("Хэрэглэгчийн нэр оруулна уу.");

        const payload = {
            id: getDataRow.id,
            hereglegch_ner,
            angi_id: angi,
            comand_id,
            salbar_id: salbar || null,
            userType: Progtype || null,
        };
        if (nuuts_ug && nuuts_ug.trim() !== "") payload.nuuts_ug = nuuts_ug;

        axios
            .post("/edit/user", payload)
            .then((res) => {
                Swal.fire(res.data?.msg || "Амжилттай заслаа.");
                if (typeof refreshUser === "function") refreshUser();
                if (typeof closeModal === "function") closeModal();
            })
            .catch((err) =>
                Swal.fire(err.response?.data?.msg || "Алдаа гарлаа!")
            );
    };

    return (
        <div className="modal" id="userEdit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Хэрэглэгч засах</h4>
                        <button
                            data-dismiss="modal"
                            className="close"
                            onClick={() => closeModal?.()}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* Хэрэглэгчийн нэр */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                Хэрэглэгчийн нэр:
                            </span>
                            <input
                                className="form-control"
                                value={hereglegch_ner}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Нууц үг */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">Нууц үг:</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={nuuts_ug}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Шинэ нууц үг оруулбал солигдоно"
                            />
                            <span
                                className="input-group-text"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Командлал */}
                        <div className="row mb-2">
                            <div className="col-md-3">Командлал:</div>
                            <div className="col-md-9">
                                <select
                                    className="form-control"
                                    value={comand_id}
                                    onChange={(e) =>
                                        setComandID(e.target.value)
                                    }
                                >
                                    <option value="">Сонгоно уу</option>
                                    {getComandlal.map((el) => (
                                        <option
                                            key={el.id}
                                            value={String(el.id)}
                                        >
                                            {el.ShortName ?? el.ner ?? el.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Анги */}
                        <div className="row mb-2">
                            <div className="col-md-3">Анги:</div>
                            <div className="col-md-9">
                                <Select
                                    options={
                                        Array.isArray(getUnits)
                                            ? getUnits.map((u) => ({
                                                  value: String(u.id),
                                                  label: u.ner,
                                              }))
                                            : []
                                    }
                                    value={
                                        (Array.isArray(getUnits)
                                            ? getUnits.map((u) => ({
                                                  value: String(u.id),
                                                  label: u.ner,
                                              }))
                                            : []
                                        ).find(
                                            (o) =>
                                                String(o.value) === String(angi)
                                        ) || null
                                    }
                                    onChange={(sel) =>
                                        setAngi(sel ? sel.value : "")
                                    }
                                    placeholder="Сонгоно уу"
                                    isClearable
                                />
                            </div>
                        </div>

                        {/* Салбар */}
                        <div className="row mb-2">
                            <div className="col-md-3">Салбар:</div>
                            <div className="col-md-9">
                                <Select
                                    options={salbarOptions}
                                    value={
                                        salbarOptions.find(
                                            (o) => o.value === String(salbar)
                                        ) || null
                                    }
                                    onChange={(sel) =>
                                        setSalbarID(sel ? sel.value : "")
                                    }
                                    isClearable
                                    placeholder="Сонгоно уу"
                                />
                            </div>
                        </div>

                        {/* Програм төрөл */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                Хэрэглэгчийн түвшин: :
                            </span>
                            <select
                                className="form-control"
                                value={Progtype}
                                onChange={(e) => setProgtypeID(e.target.value)}
                            >
                                <option value="">Сонгоно уу</option>
                                {getProgtype.map((el) => (
                                    <option key={el.id} value={String(el.id)}>
                                        {el.Pname ?? el.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Хэрэглэгчийн түвшин */}
                        {/* <div className="input-group mb-3">
                            <span className="input-group-text">
                                Хэрэглэгчийн түвшин:
                            </span>
                            <select
                                className="form-control"
                                value={Utype}
                                onChange={(e) => setUtypeID(e.target.value)}
                            >
                                <option value="">Сонгоно уу</option>
                                {getUtype.map((el) => (
                                    <option key={el.id} value={String(el.id)}>
                                        {el.Uname ?? el.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        {/* Системийн түвшин */}
                        {/* <div className="input-group mb-3">
                            <span className="input-group-text">
                                Системийн түвшин:
                            </span>
                            <select
                                className="form-control"
                                value={Sectype}
                                onChange={(e) => setSectypeID(e.target.value)}
                            >
                                <option value="">Сонгоно уу</option>
                                {getSectype.map((el) => (
                                    <option key={el.id} value={String(el.id)}>
                                        {el.Nname ?? el.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-success"
                            onClick={saveUnitSub}
                        >
                            Засах
                        </button>
                        <button
                            data-dismiss="modal"
                            className="btn btn-danger"
                            onClick={() => closeModal?.()}
                        >
                            Хаах
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEdit;
