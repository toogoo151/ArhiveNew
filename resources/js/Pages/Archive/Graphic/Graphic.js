import {
    ArcElement,
    Chart as ChartJS,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useMemo, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import axios from "../../../AxiosUser";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

/* ================= CENTER TEXT (Donut) ================= */
const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
        const { ctx } = chart;
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

        const x = chart.getDatasetMeta(0).data[0].x;
        const y = chart.getDatasetMeta(0).data[0].y;

        ctx.save();
        ctx.font = "bold 26px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(total, x, y);
        ctx.restore();
    },
};

ChartJS.register(centerTextPlugin);

/* ================= COMPONENT ================= */
const Graphic = () => {
    // Available years from database
    const [availableYears, setAvailableYears] = useState([]);
    const [minYear, setMinYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);
    const [yearsLoading, setYearsLoading] = useState(true);

    // Per-card filters (From/To) - auto-set from DB min/max
    const [baingaFrom, setBaingaFrom] = useState(null);
    const [baingaTo, setBaingaTo] = useState(null);
    const [turFrom, setTurFrom] = useState(null);
    const [turTo, setTurTo] = useState(null);
    const [dalan70From, setDalan70From] = useState(null);
    const [dalan70To, setDalan70To] = useState(null);

    const [baingaCounts, setBaingaCounts] = useState({ baingaIlt: 0, baingaNuuts: 0 });
    const [turCounts, setTurCounts] = useState({ turIlt: 0, turNuuts: 0 });
    const [dalan70Counts, setDalan70Counts] = useState({ dalanJilHun: 0, dalanJilSanhuu: 0 });

    const [baingaLoading, setBaingaLoading] = useState(true);
    const [turLoading, setTurLoading] = useState(true);
    const [dalan70Loading, setDalan70Loading] = useState(true);
    const [baingaError, setBaingaError] = useState(null);
    const [turError, setTurError] = useState(null);
    const [dalan70Error, setDalan70Error] = useState(null);

    // Fetch available years from database on mount
    useEffect(() => {
        setYearsLoading(true);
        axios
            .post("/get/graphic-available-years")
            .then((res) => {
                const years = res.data?.years || [];
                const min = res.data?.minYear;
                const max = res.data?.maxYear;
                setAvailableYears(years);
                setMinYear(min);
                setMaxYear(max);
                // Auto-set FROM/TO to min/max
                if (min !== null && max !== null) {
                    setBaingaFrom(min);
                    setBaingaTo(max);
                    setTurFrom(min);
                    setTurTo(max);
                    setDalan70From(min);
                    setDalan70To(max);
                }
            })
            .catch((e) => {
                console.error("Failed to fetch available years:", e);
                // Fallback to current year if DB fails
                const currentYear = new Date().getFullYear();
                const fallbackYears = [currentYear];
                setAvailableYears(fallbackYears);
                setMinYear(currentYear);
                setMaxYear(currentYear);
                setBaingaFrom(currentYear);
                setBaingaTo(currentYear);
                setTurFrom(currentYear);
                setTurTo(currentYear);
                setDalan70From(currentYear);
                setDalan70To(currentYear);
            })
            .finally(() => setYearsLoading(false));
    }, []);

    const fetchDalan70 = () => {
        setDalan70Loading(true);
        setDalan70Error(null);
        return axios
            .post("/get/graphic-70year-counts", {
                startYear: dalan70From,
                endYear: dalan70To,
            })
            .then((res) => {
                setDalan70Counts({
                    dalanJilHun: res.data?.dalanJilHun ?? 0,
                    dalanJilSanhuu: res.data?.dalanJilSanhuu ?? 0,
                });
            })
            .catch((e) => {
                console.error(e);
                setDalan70Error("Өгөгдөл ачааллахад алдаа гарлаа.");
                setDalan70Counts({ dalanJilHun: 0, dalanJilSanhuu: 0 });
            })
            .finally(() => setDalan70Loading(false));
    };

    const fetchBainga = () => {
        setBaingaLoading(true);
        setBaingaError(null);
        return axios
            .post("/get/graphic-year-range-counts", { startYear: baingaFrom, endYear: baingaTo })
            .then((res) => {
                setBaingaCounts({
                    baingaIlt: res.data?.baingaIlt ?? 0,
                    baingaNuuts: res.data?.baingaNuuts ?? 0,
                });
            })
            .catch((e) => {
                console.error(e);
                setBaingaError("Өгөгдөл ачааллахад алдаа гарлаа.");
                setBaingaCounts({ baingaIlt: 0, baingaNuuts: 0 });
            })
            .finally(() => setBaingaLoading(false));
    };

    const fetchTur = () => {
        setTurLoading(true);
        setTurError(null);
        return axios
            .post("/get/graphic-year-range-counts", { startYear: turFrom, endYear: turTo })
            .then((res) => {
                setTurCounts({
                    turIlt: res.data?.turIlt ?? 0,
                    turNuuts: res.data?.turNuuts ?? 0,
                });
            })
            .catch((e) => {
                console.error(e);
                setTurError("Өгөгдөл ачааллахад алдаа гарлаа.");
                setTurCounts({ turIlt: 0, turNuuts: 0 });
            })
            .finally(() => setTurLoading(false));
    };

    useEffect(() => {
        if (baingaFrom !== null && baingaTo !== null) {
            fetchBainga();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baingaFrom, baingaTo]);

    useEffect(() => {
        if (turFrom !== null && turTo !== null) {
            fetchTur();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turFrom, turTo]);

    useEffect(() => {
        if (dalan70From !== null && dalan70To !== null) {
            fetchDalan70();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dalan70From, dalan70To]);

    /* ================= PIE: Bainga (Bainga Ilt + Bainga Nuuts) ================= */
    const baingaChartData = useMemo(
        () => ({
            labels: ["Байна хадгалах хадгаламжийн нэгж - Илт", "Байнга хадгалах хадгаламжийн нэгж - Нууц"],
            datasets: [
                {
                    data: [baingaCounts.baingaIlt, baingaCounts.baingaNuuts],
                    backgroundColor: ["#4facfe", "#43e97b"],
                    borderWidth: 2,
                },
            ],
        }),
        [baingaCounts.baingaIlt, baingaCounts.baingaNuuts]
    );

    /* ================= DONUT: Tur (Tur Ilt + Tur Nuuts) ================= */
    const turChartData = useMemo(
        () => ({
            labels: ["Түр хадгалагдах хадгаламжийн нэгж - Илт", "Түр хадгалагдах хадгаламжийн нэгж - Нууц"],
            datasets: [
                {
                    data: [turCounts.turIlt, turCounts.turNuuts],
                    backgroundColor: ["#fa709a", "#fee140"],
                    borderWidth: 2,
                },
            ],
        }),
        [turCounts.turIlt, turCounts.turNuuts]
    );

    /* ================= 70 жил: Хүний нөөц (DalanJilHun) ================= */
    const dalan70HunChartData = useMemo(
        () => ({
            labels: ["70 жил хадгалах - Хүний нөөц"],
            datasets: [
                {
                    data: [dalan70Counts.dalanJilHun],
                    backgroundColor: ["#6366f1"],
                    borderWidth: 2,
                },
            ],
        }),
        [dalan70Counts.dalanJilHun]
    );

    /* ================= 70 жил: Санхүү (DalanJilSanhuu) ================= */
    const dalan70SanhuuChartData = useMemo(
        () => ({
            labels: ["70 жил хадгалах - Санхүү"],
            datasets: [
                {
                    data: [dalan70Counts.dalanJilSanhuu],
                    backgroundColor: ["#14b8a6"],
                    borderWidth: 2,
                },
            ],
        }),
        [dalan70Counts.dalanJilSanhuu]
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
            datalabels: {
                color: "#fff",
                font: { weight: "bold" },
            },
        },
    };

    return (
        <div className="GraphicWrapper">
            <div className="header">
                <h2>📊 Жилийн график</h2>
            </div>

            {yearsLoading && (
                <div className="loading-box">Жилийн мэдээлэл ачааллаж байна...</div>
            )}

            {!yearsLoading && availableYears.length === 0 && (
                <div className="error-msg">
                    Өгөгдөл олдсонгүй. Хадгаламжийн мэдээлэл байхгүй байна.
                </div>
            )}

            {!yearsLoading && availableYears.length > 0 && (
            <div className="row">
                <div className="card">
                    <div className="card-head">
                        <h4>📁 Байнга</h4>
                        <div className="filters">
                            <select
                                value={baingaFrom ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setBaingaFrom(v);
                                    if (v > baingaTo) setBaingaTo(v);
                                }}
                                disabled={baingaLoading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`b-from-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                            <span className="to">→</span>
                            <select
                                value={baingaTo ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setBaingaTo(v);
                                    if (v < baingaFrom) setBaingaFrom(v);
                                }}
                                disabled={baingaLoading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`b-to-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {baingaError && (
                        <div className="error-msg">
                            {baingaError}
                            <button type="button" onClick={fetchBainga}>
                                Дахин оролдох
                            </button>
                        </div>
                    )}

                    {baingaLoading ? (
                        <div className="loading-box">Өгөгдөл ачааллаж байна...</div>
                    ) : (
                        <div className="chart-box">
                            <Pie data={baingaChartData} options={options} />
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-head">
                        <h4>📁 Түр</h4>
                        <div className="filters">
                            <select
                                value={turFrom ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setTurFrom(v);
                                    if (v > turTo) setTurTo(v);
                                }}
                                disabled={turLoading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`t-from-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                            <span className="to">→</span>
                            <select
                                value={turTo ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setTurTo(v);
                                    if (v < turFrom) setTurFrom(v);
                                }}
                                disabled={turLoading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`t-to-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {turError && (
                        <div className="error-msg">
                            {turError}
                            <button type="button" onClick={fetchTur}>
                                Дахин оролдох
                            </button>
                        </div>
                    )}

                    {turLoading ? (
                        <div className="loading-box">Өгөгдөл ачааллаж байна...</div>
                    ) : (
                        <div className="chart-box">
                            <Doughnut
                                data={turChartData}
                                options={{
                                    ...options,
                                    cutout: "70%",
                                    plugins: {
                                        ...options.plugins,
                                        centerText: true,
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* 70 жил хадгалах хүний нөөц (DalanJilHun) */}
                <div className="card">
                    <div className="card-head">
                        <h4>📋 70 жил хадгалах - Хүний нөөц</h4>
                        <div className="filters">
                            <select
                                value={dalan70From ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setDalan70From(v);
                                    if (v > dalan70To) setDalan70To(v);
                                }}
                                disabled={dalan70Loading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`d70-from-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                            <span className="to">→</span>
                            <select
                                value={dalan70To ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setDalan70To(v);
                                    if (v < dalan70From) setDalan70From(v);
                                }}
                                disabled={dalan70Loading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`d70-to-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                    {dalan70Error && (
                        <div className="error-msg">
                            {dalan70Error}
                            <button type="button" onClick={fetchDalan70}>
                                Дахин оролдох
                            </button>
                        </div>
                    )}
                    {dalan70Loading ? (
                        <div className="loading-box">Өгөгдөл ачааллаж байна...</div>
                    ) : (
                        <div className="chart-box">
                            <Doughnut
                                data={dalan70HunChartData}
                                options={{
                                    ...options,
                                    cutout: "70%",
                                    plugins: {
                                        ...options.plugins,
                                        centerText: true,
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* 70 жил хадгалах санхүү (DalanJilSanhuu) */}
                <div className="card">
                    <div className="card-head">
                        <h4>📋 70 жил хадгалах - Санхүү</h4>
                        <div className="filters">
                            <select
                                value={dalan70From ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setDalan70From(v);
                                    if (v > dalan70To) setDalan70To(v);
                                }}
                                disabled={dalan70Loading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`d70s-from-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                            <span className="to">→</span>
                            <select
                                value={dalan70To ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setDalan70To(v);
                                    if (v < dalan70From) setDalan70From(v);
                                }}
                                disabled={dalan70Loading || yearsLoading || !availableYears.length}
                            >
                                {availableYears.length === 0 ? (
                                    <option value="">...</option>
                                ) : (
                                    availableYears.map((y) => (
                                        <option key={`d70s-to-${y}`} value={y}>
                                            {y}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                    {dalan70Error && (
                        <div className="error-msg">
                            {dalan70Error}
                            <button type="button" onClick={fetchDalan70}>
                                Дахин оролдох
                            </button>
                        </div>
                    )}
                    {dalan70Loading ? (
                        <div className="loading-box">Өгөгдөл ачааллаж байна...</div>
                    ) : (
                        <div className="chart-box">
                            <Doughnut
                                data={dalan70SanhuuChartData}
                                options={{
                                    ...options,
                                    cutout: "70%",
                                    plugins: {
                                        ...options.plugins,
                                        centerText: true,
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            )}

            <style>{`
                .GraphicWrapper {
                    min-height: 100vh;
                    padding: 25px;
                    background: #f3f4f6;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .card-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 8px;
                }

                .filters {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .filters .to {
                    color: #64748b;
                    font-weight: 600;
                }

                .error-msg {
                    background: #fef2f2;
                    color: #b91c1c;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .error-msg button {
                    padding: 6px 12px;
                    border-radius: 6px;
                    border: 1px solid #b91c1c;
                    background: #fff;
                    color: #b91c1c;
                    cursor: pointer;
                }

                .loading-box {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6b7280;
                }
                    .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

/* Mobile */
@media (max-width: 768px) {
    .row {
        grid-template-columns: 1fr;
    }
}




                .card {
                    width: 100%;
                    background: #fff;
                    padding: 20px;
                    border-radius: 14px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                }

                .card h4 {
                    margin: 0 0 16px 0;
                    font-size: 1rem;
                }

                .chart-box {
                    height: 360px;
                }

                select {
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: 1px solid #d1d5db;
                }
            `}</style>
        </div>
    );
};

export default Graphic;
