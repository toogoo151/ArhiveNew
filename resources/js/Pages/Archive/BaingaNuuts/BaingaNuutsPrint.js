import { Fragment, useState } from "react";
import Swal from "sweetalert2";
import "../BaingaIlts/Print.css";

const BaingaNuutsPrint = ({ show, onClose, selectedRowsData }) => {
    const [expandedRows, setExpandedRows] = useState([]);

    if (!show) return null;

    // Хэвлэх функц
    const handlePrint = () => {
        const content = document.getElementById("printable-content");
        const printWindow = window.open("", "", "height=600,width=800");

        // Хэвлэх цонхонд тохиргоо хийх
        printWindow.document.write(`
        <html>
            <head>
                <title>Баримт</title>
                <style>
                    body {
                        margin-left: 3cm;   /* Зүүн талд 3 см */
                        margin-top: 2cm;    /* Дээд талд 2 см */
                        margin-right: 1.5cm; /* Баруун талд 1.5 см */
                        margin-bottom: 2cm;  /* Доод талд 2 см */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 5px;
                        border: 1px solid black;
                        text-align: center;
                    }
                    .content-header {
                        text-align: center;
                    }
                    .content-header h2 {
                        margin: 0;
                    }
                    .content-footer {
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="content-header">
                    <h2>ЗЭВСЭГТ ХҮЧНИЙ ЖАНЖИН ШТАБ</h2>
                    <h3>НУУЦ БАРИМТ БИЧИГ УСТГАХ АКТ № …</h3>
                    <p>БАТЛАВ: 2019 оны 01 дүгээр сарын ........–ны өдөр</p>
                </div>

                ${content.innerHTML}

                <div class="content-footer">
                    <textarea
                        class="word-text"
                        defaultValue="КОМИССЫН НАРИЙН БИЧГИЙН ДАРГА: ................."
                    ></textarea>
                    <textarea
                        class="word-text"
                        defaultValue="ГИШҮҮД: ...................................."
                    ></textarea>
                    <textarea
                        class="word-text"
                        defaultValue="ГИШҮҮД: ...................................."
                    ></textarea>
                </div>
            </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.print();

        Swal.fire({
            icon: "success",
            title: "Амжилттай хэвлэгдлээ",
        });

        onClose();
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
                            🗂 ИЛ БАРИМТ БИЧИГ УСТГАХ АКТ
                        </h5>
                        <button className="close" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body" id="printable-content">
                        <div className="input-wrapper">
                            {/* <div className="doc-top">
                       
                                <div className="doc-box">
                                    <textarea
                                        className="doc-textarea"
                                        defaultValue="БАТЛАВ"
                                    />
                                </div>

                           
                                <div className="doc-center">
                                    <input
                                        className="doc-input"
                                        defaultValue="ЗЭВСЭГТ ХҮЧНИЙ ЖАНЖИН ШТАБ"
                                    />
                                    <input
                                        className="doc-input bold"
                                        defaultValue="НУУЦ БАРИМТ БИЧИГ УСТГАХ АКТ № …"
                                    />
                                    <textarea
                                        className="doc-textarea center-area"
                                        defaultValue=""
                                    />
                                </div>

                               
                                <div className="doc-box">
                                    <textarea
                                        className="doc-textarea"
                                        defaultValue="БАТЛАВ 
2019 оны 01 дүгээр сарын ........–ны өдөр"
                                    />
                                </div>
                            </div>
                            */}
                            <div className="top-inputs">
                                {/* ЗҮҮН */}
                                <div className="left-box">
                                    <textarea
                                        className="word-text auto-textarea"
                                        defaultValue="БАТЛАВ"
                                        onInput={autoResize}
                                    />
                                    <textarea
                                        className="word-text auto-textarea"
                                        style={{ width: "100%" }}
                                        defaultValue="Зэвсэгт хүчний Жанжин штабын дэргэдэх Баримт бичиг нягтлан шалгах комисс .......... нарын бүрэлдэхүүнтэй комисс нь дараах нууц баримт бичгийг устгахаар тогтов. Үүнд:"
                                        onInput={autoResize}
                                    />
                                </div>

                                {/* ГОЛ */}
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

                                {/* БАРУУН */}
                                <div className="right-box">
                                    <textarea
                                        id
                                        defaultValue={`БАТЛАВ 
2019 оны 01 дүгээр сарын ........–ны өдөр`}
                                    />
                                </div>
                            </div>

                            {/* TABLE */}
                            <table className="table table-bordered">
                                <thead>
                                    {/* 1-р мөр */}
                                    <tr>
                                        <th rowSpan="3">ЗБ нэгжийн нэр</th>
                                        <th rowSpan="3">№</th>
                                        <th rowSpan="3">
                                            Хэрэг данс бүртгэлийн нэр
                                        </th>
                                        <th rowSpan="3">Нууцын зэрэг</th>

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

                                    {/* 2-р мөр */}
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
                                                                {row.hn_zbn}
                                                            </td>
                                                            <td>{row.id}</td>
                                                            <td>
                                                                {row.hn_garchig}
                                                            </td>
                                                            <td>
                                                                {
                                                                    row.nuuts_zereglel
                                                                }
                                                            </td>

                                                            <td>
                                                                {row.on_ehen}
                                                            </td>
                                                            <td>
                                                                {row.on_suul}
                                                            </td>
                                                            <td>{row.hn_dd}</td>
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
                                <textarea
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

export default BaingaNuutsPrint;
