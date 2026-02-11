import { Fragment, useEffect, useState } from "react";
import "./Print.css";

const TurPrint = ({ show, onClose, selectedRowsData }) => {
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        if (show) {
            // Эхэнд бүх жилүүдийг өргөжүүлсэн байдалтай тохируулна
            setExpandedRows(Object.keys(groupedData));
        }
    }, [show, selectedRowsData]);

    if (!show) return null;

    // Хэвлэх функц
    const handlePrint = () => {
        const original = document.getElementById("printable-content");
        const clone = original.cloneNode(true);

        // input, textarea → div
        clone.querySelectorAll("input, textarea").forEach((el) => {
            const div = document.createElement("div");
            div.innerText = el.value;
            div.className = el.className; // ⭐ class дамжуулна
            div.style.whiteSpace = "pre-wrap";
            div.style.fontFamily = "Arial";
            div.style.fontSize = "12pt";
            el.replaceWith(div);
        });

        const printWindow = window.open("", "_blank", "width=900,height=650");

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Байнга илт</title>
    <style>
      @page {
    size: A4 portrait;
    margin-left: 3cm;
    margin-top: 2cm;
    margin-right: 1.5cm;
    margin-bottom: 2cm;
}

html, body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12pt;
    color: #000;
}

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }

        .top-row {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 6mm;
        }

        .top-row > div {
            display: table-cell;
            vertical-align: top;
        }

        .left-box { width: 40mm; }
 .right-box {
    display: flex !important;
    justify-content: flex-end !important; /* box баруун талдаа */
    align-items: flex-start !important;
}

.right-box * {
    width: 80mm;
    text-align: center !important;
    white-space: nowrap !important;   /* ⬅️ мөр хугарахыг зогсооно */
    word-break: keep-all !important;  /* ⬅️ -ны дээр тасрахгүй */
}


        .center-row {
    display: flex;
    justify-content: center; /* хөндлөн тэнхлэг дээр төв */
    align-items: center; /* босоо тэнхлэг дээр төв */
    margin-top: 6mm;
}
    .center-box
    {
    display: flex;
    flex-direction: column; /* дотоод div-үүдийг босоо байрлуулах */
    align-items: center; /* дотоод элементийг голдоо */
    font-weight: bold;
    line-height: 1.6;
    }

        textarea, input {
            border: none;
        }
    </style>
</head>
<body>
    ${clone.innerHTML}
</body>
</html>
    `);
        // Устгах
        printWindow.document.close();
        printWindow.focus();

        // Хэвлэх товчийг дарах
        printWindow.print();
    };

    // Харьяа оноор бүлэглэх
    const groupedData = selectedRowsData.reduce((acc, row) => {
        if (!acc[row.harya_on]) acc[row.harya_on] = [];
        acc[row.harya_on].push(row);
        return acc;
    }, {});

    const toggleRow = (year) => {
        setExpandedRows((prev) =>
            prev.includes(year)
                ? prev.filter((y) => y !== year)
                : [...prev, year]
        );
    };

    const autoResize = (e) => {
        const el = e.target;
        el.style.height = "auto";

        const minHeight = 12 * 3.78; // 12mm
        const maxHeight = 60 * 3.78; // 60mm

        el.style.height =
            Math.min(Math.max(el.scrollHeight, minHeight), maxHeight) + "px";
    };

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            🗂 ТҮР ИЛТ БАРИМТ БИЧИГ УСТГАХ АКТ
                        </h5>
                        <button className="close" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    {/* BODY */}
                    <div
                        className="modal-body bainga-print"
                        id="printable-content"
                    >
                        <div className="input-wrapper">
                            <div className="top-table">
                                {/* 1-р мөр */}
                                <div className="top-row">
                                    <div className="left-box">
                                        <textarea
                                            style={{ width: "100%" }}
                                            defaultValue="БАТЛАВ"
                                            className="no-border center-text"
                                        />
                                    </div>

                                    <div className="right-box">
                                        <textarea
                                            style={{ width: "100%" }}
                                            defaultValue={`БАТЛАВ
2019 оны 01 дүгээр сарын …-ны өдөр`}
                                            className="no-border center-text"
                                        />
                                    </div>
                                </div>

                                {/* 2-р мөр – ГОЛ */}
                                <div className="center-row">
                                    <div
                                        className="center-box"
                                        style={{ width: "100%" }}
                                    >
                                        <div>
                                            <input
                                                style={{
                                                    width: "160%",
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                }}
                                                defaultValue="ЗЭВСЭГТ ХҮЧНИЙ ЖАНЖИН ШТАБ"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                style={{ width: "160%" }}
                                                defaultValue="НУУЦ БАРИМТ БИЧИГ УСТГАХ АКТ № …"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="top-inputs">

                                <div className="left-box">
                                    <textarea
                                        className="word-text auto-textarea"
                                        defaultValue="БАТЛАВ"
                                        onInput={autoResize}
                                    />
                                </div>


                                <div className="center-box">
                                    <input
                                        id="3"
                                        defaultValue="ЗЭВСЭГТ ХҮЧНИЙ ЖАНЖИН ШТАБ"
                                    />
                                    <input
                                        id="4"
                                        defaultValue="НУУЦ БАРИМТ БИЧИГ УСТГАХ АКТ № …"
                                    />
                                </div>


                                <div className="right-box">
                                    <textarea
                                        id
                                        defaultValue="БАТЛАВ
2019 оны 01 дүгээр сарын ........–ны өдөр"
                                    />
                                </div>
                            </div> */}
                            <textarea
                                className="word-text auto-textarea"
                                style={{ width: "100%" }}
                                defaultValue="Зэвсэгт хүчний Жанжин штабын дэргэдэх Баримт бичиг нягтлан шалгах комисс .......... нарын бүрэлдэхүүнтэй комисс нь дараах нууц баримт бичгийг устгахаар тогтов. Үүнд:"
                                onInput={autoResize}
                            />
                            &nbsp;
                            {/* TABLE */}
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th rowSpan="3">ЗБ нэгжийн нэр</th>
                                        <th rowSpan="3">№</th>
                                        <th rowSpan="3">
                                            Хадгаламжийн нэгжийн гарчиг
                                        </th>

                                        <th
                                            colSpan="2"
                                            style={{ textAlign: "center" }}
                                        >
                                            Материалын он
                                        </th>

                                        <th rowSpan="3">
                                            Бичиг баримтын дугаар
                                        </th>

                                        <th
                                            colSpan="2"
                                            style={{ textAlign: "center" }}
                                        >
                                            Хуудасны тоо
                                        </th>

                                        <th rowSpan="3">Тайлбар</th>
                                    </tr>

                                    <tr>
                                        <th>Эхлэл</th>
                                        <th>Төгсгөл</th>
                                        <th>Нэг бүрийн</th>
                                        <th>Бүгд</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Object.keys(groupedData).map((year) => (
                                        <Fragment key={year}>
                                            {/* Харьяа он */}
                                            <tr
                                                onClick={() => toggleRow(year)}
                                                style={{
                                                    backgroundColor: "#f5f5f5",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <td colSpan="9">
                                                    {/* + / - icon */}
                                                    <span
                                                        style={{
                                                            marginRight: "8px",
                                                        }}
                                                    >
                                                        {expandedRows.includes(
                                                            year
                                                        )}
                                                    </span>
                                                    {year}
                                                </td>
                                            </tr>

                                            {/* Мэдээллийн мөрүүд */}
                                            {expandedRows.includes(year) &&
                                                groupedData[year].map(
                                                    (row, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {
                                                                    row.hadgalamj_zbn
                                                                }
                                                            </td>
                                                            <td>{row.id}</td>
                                                            <td>
                                                                {
                                                                    row.hadgalamj_garchig
                                                                }
                                                            </td>
                                                            <td>
                                                                {row.on_ehen}
                                                            </td>
                                                            <td>
                                                                {row.on_suul}
                                                            </td>
                                                            <td>
                                                                {
                                                                    row.hadgalamj_dugaar
                                                                }
                                                            </td>
                                                            <td>
                                                                {row.huudas_too}
                                                            </td>
                                                            <td>
                                                                {row.huudas_too}
                                                            </td>
                                                            <td>
                                                                {row.hn_tailbar}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                            {/* Доод input */}
                            <div className="bottom-section">
                                &nbsp;
                                <textarea
                                    style={{
                                        width: "100%",
                                        minHeight: "40mm",
                                        lineHeight: 1.6,
                                    }}
                                    className="word-text auto-textarea bottom-text"
                                    defaultValue={`КОМИССЫН НАРИЙН БИЧГИЙН ДАРГА: ...................
ГИШҮҮД: ....................................

Акт батлагдсаны дараа дээр дурьдсан баримт бичгийг акттай тулган шалгаж 2019 оны  дугаар сарын ........ өдөр .... ................................................ замаар бүрэн устгав.

ГИШҮҮД:..........................................................`}
                                    onInput={autoResize}
                                />
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            onClick={handlePrint}
                        >
                            Хэвлэх
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Болих
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurPrint;
