import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "../../../AxiosUser";

const UserNew = ({ refreshUser }) => {
    const [getComandlal, setComandlal] = useState([]);
    const [getUnits, setUnit] = useState([]);
    const [getSalbar, setSalbar] = useState([]);
    const [getProgtype, setProgtype] = useState([]);
    const [getUtype, setUtype] = useState([]);
    const [getSectype, setSectype] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    // -------------------- Load Data --------------------
    useEffect(() => {
        axios
            .get("/get/comandlal")
            .then((res) => setComandlal(res.data))
            .catch((err) => console.log(err));
        axios
            .get("/get/ProgrammType")
            .then((res) => setProgtype(res.data))
            .catch((err) => console.log(err));
        axios
            .get("/get/UserType")
            .then((res) => setUtype(res.data))
            .catch((err) => console.log(err));
        axios
            .get("/get/SecType")
            .then((res) => setSectype(res.data))
            .catch((err) => console.log(err));
    }, []);

    // -------------------- Form Validation --------------------
    const formSchema = Yup.object().shape({
        hereglegch_ner: Yup.string().required("Хэрэглэгчийн нэр оруулна уу."),
        nuuts_ug: Yup.string().required("Нууц үг оруулна уу."),
        comand_id: Yup.string().required("Командлал сонгоно уу."),
        angi: Yup.string().required("Анги сонгоно уу."),
        salbar: Yup.string(),
        barimt_turul: Yup.string().required("Программын төрөл сонгоно уу."),
        bichig_turul: Yup.string().required("Хэрэглэгчийн түвшин сонгоно уу."),
        tubshin: Yup.string().required("Нууцын төрөл сонгоно уу."),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema),
    });

    // -------------------- Dependent Selects --------------------
    const changeComandlal = (e) => {
        const comandId = e.target.value;
        setValue("comand_id", comandId);
        setValue("angi", "");
        setValue("salbar", "");
        setSalbar([]);
        if (!comandId) return;
        axios
            .post("/get/angi/byComandlalID", { id: comandId })
            .then((res) => setUnit(res.data))
            .catch((err) => console.log(err));
    };

    const changeAngi = (angiID) => {
        setValue("angi", angiID);
        setValue("salbar", "");
        if (!angiID) {
            setSalbar([]);
            return;
        }
        axios
            .post("/get/byAngiID", { id: angiID })
            .then((res) => setSalbar(res.data))
            .catch((err) => console.log(err));
    };

    // -------------------- Submit --------------------
    const onSubmit = (data) => {
        axios
            .post("/new/user", {
                hereglegch_ner: data.hereglegch_ner,
                nuuts_ug: data.nuuts_ug,
                angi_id: data.angi,
                comand_id: data.comand_id,
                salbar_id: data.salbar || null,
                barimt_turul: data.barimt_turul,
                bichig_turul: data.bichig_turul,
                tubshin: data.tubshin,
            })
            .then((res) => {
                Swal.fire(res.data.msg);
                reset({
                    hereglegch_ner: "",
                    nuuts_ug: "",
                    comand_id: "",
                    angi: "",
                    salbar: "",
                    barimt_turul: "",
                    bichig_turul: "",
                    tubshin: "",
                });
                setUnit([]);
                setSalbar([]);
                refreshUser();
            })
            .catch((err) => {
                Swal.fire(err.response.data.msg || "Алдаа гарлаа!");
            });
    };

    // -------------------- Render --------------------
    return (
        <div className="modal" id="userNew">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h4 className="modal-title">Хэрэглэгч нэмэх</h4>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                        >
                            ×
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {/* User Name */}
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Хэрэглэгчийн нэр:
                                        </span>
                                    </div>
                                    <input
                                        {...register("hereglegch_ner")}
                                        className="form-control"
                                    />
                                </div>
                                <p className="alerts">
                                    {errors.hereglegch_ner?.message}
                                </p>
                            </div>

                            {/* Password with Hide/Show */}
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Нууц үг:
                                        </span>
                                    </div>

                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        {...register("nuuts_ug")}
                                        className="form-control"
                                    />

                                    <div className="input-group-append">
                                        <span
                                            className="input-group-text"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <p className="alerts">
                                    {errors.nuuts_ug?.message}
                                </p>
                            </div>

                            {/* Командлал */}
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Командлал:
                                        </span>
                                    </div>
                                    <select
                                        className="form-control"
                                        onChange={changeComandlal}
                                        value={getValues("comand_id")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {getComandlal.map((el) => (
                                            <option key={el.id} value={el.id}>
                                                {el.ShortName}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="alerts">
                                        {errors.comand_id?.message}
                                    </p>
                                </div>
                            </div>

                            {/* Анги */}
                            {getUnits.length > 0 && (
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Анги:
                                            </span>
                                        </div>
                                        <Select
                                            options={getUnits.map((unit) => ({
                                                value: unit.id,
                                                label: unit.ner,
                                            }))}
                                            value={
                                                getUnits
                                                    .filter(
                                                        (u) =>
                                                            u.id ===
                                                            getValues("angi")
                                                    )
                                                    .map((u) => ({
                                                        value: u.id,
                                                        label: u.ner,
                                                    }))[0]
                                            }
                                            onChange={(selected) =>
                                                changeAngi(
                                                    selected
                                                        ? selected.value
                                                        : ""
                                                )
                                            }
                                            placeholder="Сонгоно уу"
                                            isSearchable
                                        />
                                        <p className="alerts">
                                            {errors.angi?.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Салбар */}
                            {getSalbar.length > 0 && (
                                <div className="row">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                Салбар:
                                            </span>
                                        </div>
                                        <Select
                                            options={getSalbar.map((unit) => ({
                                                value: unit.id,
                                                label: unit.salbar,
                                            }))}
                                            value={
                                                getSalbar
                                                    .filter(
                                                        (u) =>
                                                            u.id ===
                                                            getValues("salbar")
                                                    )
                                                    .map((u) => ({
                                                        value: u.id,
                                                        label: u.salbar,
                                                    }))[0] || null
                                            }
                                            onChange={(selected) =>
                                                setValue(
                                                    "salbar",
                                                    selected
                                                        ? selected.value
                                                        : ""
                                                )
                                            }
                                            placeholder="Сонгоно уу"
                                            isSearchable
                                        />
                                        <p className="alerts">
                                            {errors.salbar?.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Программын төрөл */}
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Программын төрөл:
                                        </span>
                                    </div>
                                    <select
                                        className="form-control"
                                        {...register("barimt_turul")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {getProgtype.map((el) => (
                                            <option key={el.id} value={el.id}>
                                                {el.Pname}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="alerts">
                                        {errors.barimt_turul?.message}
                                    </p>
                                </div>
                            </div>

                            {/* Хэрэглэгчийн түвшин */}
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Хэрэглэгчийн түвшин:
                                        </span>
                                    </div>
                                    <select
                                        className="form-control"
                                        {...register("bichig_turul")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {getUtype.map((el) => (
                                            <option key={el.id} value={el.id}>
                                                {el.Uname}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="alerts">
                                        {errors.bichig_turul?.message}
                                    </p>
                                </div>
                            </div>

                            {/* Нууцын төрөл */}
                            <div className="row">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            Нууцын төрөл:
                                        </span>
                                    </div>
                                    <select
                                        className="form-control"
                                        {...register("tubshin")}
                                    >
                                        <option value="">Сонгоно уу</option>
                                        {getSectype.map((el) => (
                                            <option key={el.id} value={el.id}>
                                                {el.Nname}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="alerts">
                                        {errors.tubshin?.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">
                                Нэмэх
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                            >
                                Хаах
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserNew;
