import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "../../../AxiosUser";

/* ================= REGISTER ================= */
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

/* ================= CENTER TEXT PLUGIN ================= */
const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart, args, opts) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

        ctx.save();
        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = opts.color || "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            total || 0,
            (chartArea.left + chartArea.right) / 2,
            (chartArea.top + chartArea.bottom) / 2
        );
        ctx.restore();
    },
};

ChartJS.register(centerTextPlugin);

/* ================= COMPONENT ================= */
const Graphic = () => {
    const [dark, setDark] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    const [summary, setSummary] = useState({
        class: 0,
        user: 0,
        huthereg: 0,
    });

    const [monthly, setMonthly] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [chartKey, setChartKey] = useState(0);

    /* ================= DARK MODE LISTENER ================= */
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = () => setDark(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    /* ================= AUTO FETCH ================= */
    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    /* ================= FETCH ================= */
    const fetchData = async () => {
        setLoading(true);
        try {
            const summaryRes = await axios.post("/get/summary", {
                startDate: startDate || null,
                endDate: endDate || null,
            });
            setSummary(summaryRes.data);

            const monthlyRes = await axios.post("/get/monthly-stat", {
                startDate: startDate || null,
                endDate: endDate || null,
            });
            setMonthly(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);

            setChartKey((k) => k + 1); // 🔑 force redraw
        } catch (e) {
            console.error(e);
            setMonthly([]);
        } finally {
            setLoading(false);
        }
    };

    /* ================= DONUT ================= */
    const donutData = useMemo(
        () => ({
            labels: ["Анги", "Хэрэглэгч", "Хөтлөх хэрэг"],
            datasets: [
                {
                    data: [summary.class, summary.user, summary.huthereg],
                    backgroundColor: ["#4facfe", "#43e97b", "#fa709a"],
                    borderWidth: 2,
                },
            ],
        }),
        [summary]
    );

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom",
                labels: { color: dark ? "#fff" : "#111" },
            },
            datalabels: {
                formatter: (v) => (v ? v : ""),
                color: "#fff",
                font: { weight: "bold", size: 14 },
            },
            centerText: {
                color: dark ? "#fff" : "#111",
            },
        },
    };

    /* ================= BAR ================= */
    const barData = {
        labels: monthly.map((m) => m.label),
        datasets: [
            {
                label: "Сарын график",
                data: monthly.map((m) => m.total),
                backgroundColor: dark
                    ? "rgba(79,172,254,0.85)"
                    : "rgba(54,162,235,0.85)",
                borderRadius: 10,
                barThickness: 32,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: dark ? "#fff" : "#111" },
            },
            datalabels: {
                anchor: "end",
                align: "top",
                color: dark ? "#fff" : "#111",
                font: { weight: "bold" },
            },
        },
        scales: {
            x: {
                ticks: { color: dark ? "#e5e7eb" : "#111" },
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: { color: dark ? "#e5e7eb" : "#111" },
            },
        },
    };

    const noData =
        summary.class + summary.user + summary.huthereg === 0 &&
        monthly.length === 0;

    /* ================= RENDER ================= */
    return (
        <div className={dark ? "wrapper dark" : "wrapper light"}>
            <div className="header">
                <h2>📊 ГРАФИК</h2>
                <button onClick={() => setDark(!dark)}>
                    {dark ? "🌞 Өдөр" : "🌙 Шөнө"}
                </button>
            </div>

            {/* FILTER */}
            <div className="filter">
                <div>
                    <label>Эхлэх</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Дуусах</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="loading">⏳ Ачаалж байна...</div>
            ) : noData ? (
                <div className="nodata">📭 Мэдээлэл олдсонгүй</div>
            ) : (
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <h4>Нийт</h4>
                            <div className="chart-box">
                                <Doughnut
                                    key={`d-${chartKey}`}
                                    data={donutData}
                                    options={donutOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card">
                            <h4>📈 Сарын</h4>
                            <div className="chart-box">
                                <Bar
                                    key={`b-${chartKey}`}
                                    data={barData}
                                    options={barOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STYLES */}
            <style>{`
                .wrapper { min-height: 100vh; padding: 25px; }
                .dark { background: #0f172a; color: #fff; }
                .light { background: #f3f4f6; color: #111; }
                .header { display: flex; justify-content: space-between; }
                .filter { display: flex; gap: 15px; margin: 15px 0; }
                .row { display: flex; gap: 20px; flex-wrap: wrap; }
                .col { flex: 1; min-width: 320px; }
                .card {
                    background: rgba(255,255,255,0.08);
                    padding: 20px;
                    border-radius: 16px;
                }
                .chart-box {
                    position: relative;
                    height: 360px;
                }
                .loading, .nodata {
                    text-align: center;
                    padding: 60px;
                    font-size: 18px;
                }
            `}</style>
        </div>
    );
};

export default Graphic;
