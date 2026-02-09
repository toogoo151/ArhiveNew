import React, { useEffect, useState } from "react";
import axios from "../../../AxiosUser";
import Swal from "sweetalert2";
import GsmafLogo from "../../../../dist/img/GsmafLogo.png";

import "./Home.css";

const Home = ({ handleFirstMenuClick, getMissionType }) => {
    return (
        <>
            <>
                {userType === "superAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "40px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br /> <br /> <br /> <br />
                                    Тавтай морил та энхийг дэмжих ажиллагааны
                                    <br />
                                    вебд амжилттай нэвтэрлээ.
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-290px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                                <br /> <br /> <br /> <br />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "comandlalAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    ЗХ-ний анги байгууллагын админ бүртгэх: :{" "}
                                    <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ХЭРЭГЛЭГЧ
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Хэрэглэгч бүртгэх
                                    </strong>{" "}
                                    туслах цэс дээр дарж өөрийн харьяа
                                    анги/нэгтгэл/, салбарын ЦАХ-ийг бүртгэнэ.
                                    /Админы эрх сонголтоос “ЗХ-ний анги
                                    байгууллага” сонголтыг сонгоно/
                                    <br />
                                    <br />
                                    Хэрэглэгч бүртгэх: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ХЭРЭГЛЭГЧ
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Хэрэглэгч бүртгэх
                                    </strong>{" "}
                                    туслах цэс дээр дарж өөрийн харьяа
                                    анги/нэгтгэл/, салбарын ЦАХ-ийг бүртгэнэ.
                                    /Админы эрх - сонголтоос “Командлалын
                                    хэрэглэгч” сонголтыг сонгоно/
                                    <br />
                                    <br />
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Санамж:
                                    </strong>{" "}
                                    Бүртгүүлсэн имэйл хаягийг баталгаажуулалт
                                    хийх учраас ЦАХ-ийн ашигладаг бодит ИМЭЙЛ
                                    хаягийг бүртгэнэ үү!.
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-620px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "gsmafAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Туслах сан: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        БИЧИГ БАРИМТ
                                    </strong>{" "}
                                    цэс дээр дарж Энхийг дэмжих ажиллагаанд
                                    үүрэг гүйцэтгэх хүсэлтэй ЦАХ-ийн бүрдүүлэх
                                    бичиг баримтын төрлүүдийг оруулна.
                                    <br />
                                    <br />
                                    Шийдвэрлэх: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮНДСЭН
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Бичиг баримт шалгах
                                    </strong>{" "}
                                    туслах цэс дээр дарж Энхийг дэмжих
                                    ажиллагаанд үүрэг гүйцэтгэх хүсэлтээ
                                    илгээгээд “Бүрдүүлэх бичиг баримтуудыг
                                    бүгдийн оруулсан” ЦАХ-ийг харна.
                                    <br />
                                    -Бүрдүүлэх бичиг баримтуудыг бүгдийн
                                    оруулсан ЦАХ-ийн бичиг баримтуудыг тус бүр
                                    шалгаж, шаардлага хангасан тохиолдолд
                                    зөвшөөрнө.
                                    <br />
                                    -Шаардлага хангаагүй тохиолдолд татгалзана.
                                    <br />
                                    <br />
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Санамж:
                                    </strong>{" "}
                                    Татгалзсан тохиолдолд шалтгааныг заавал
                                    оруулна!.
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-650px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "batalionAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Туслах сан: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮҮРЭГ ГҮЙЦЭТГЭЛТ{" "}
                                    </strong>{" "}
                                    цэс дээр дарж “Сайшаал, шийтгэлийн”
                                    хэлбэрүүдийг оруулна.
                                    <br />
                                    <br />
                                    Оруулга: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮНДСЭН
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Үүрэг гүйцэтгэлт
                                    </strong>{" "}
                                    туслах цэс дээр дарж Энхийг дэмжих
                                    ажиллагаанд үүрэг гүйцэтгэж байгаа ЦАХ-ийг
                                    харна.
                                    <br />
                                    -ЦАХ-ийн “Үүрэг гүйцэтгэлт”-ийн мэдээг
                                    оруулна.
                                    <br />
                                    <br />
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-620px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "healthDepartmentAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Шийдвэрлэх: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮНДСЭН
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Эрүүл мэндийн хэлтэс
                                    </strong>{" "}
                                    туслах цэс дээр дарж энхийг дэмжих
                                    ажиллагаанд үүрэг гүйцэтгэх хүсэлтээ
                                    илгээгээд “ЗХЖШ-ийн хүний нөөцийн хэлтсээс
                                    зөвшөөрсөн” ЦАХ-ийг харна.
                                    <br />
                                    -Элэгний B, C вирусгүй ЦАХ-ийн хүсэлтийг
                                    зөвшөөрнө.
                                    <br />
                                    -Элэгний B, C вирустэй ЦАХ-ийн хүсэлтийг
                                    татгалзана.
                                    <br />
                                    <br />
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Санамж:
                                    </strong>{" "}
                                    Татгалзсан тохиолдолд шалтгааныг заавал
                                    оруулна!.
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-600px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "hospitalAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Шийдвэрлэх: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮНДСЭН
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Эрүүл мэндийн үзлэг
                                    </strong>{" "}
                                    туслах цэс дээр дарж энхийг дэмжих
                                    ажиллагаанд үүрэг гүйцэтгэх хүсэлтээ
                                    илгээгээд “Эрүүл мэндийн хэлтсээс
                                    зөвшөөрсөн” ЦАХ-ийг харна.
                                    <br />
                                    -Эрүүл мэндийн үзлэгээр орсон ЦАХ-ийн
                                    үзлэгийн хуудсыг шийдвэрийн хамт оруулна.
                                    <br />
                                    <br />
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Санамж:
                                    </strong>{" "}
                                    Мэдээлэл алдаатай оруулсан тохиолдолд ЭДА-ны
                                    шалгалтын комисруу тухайн мэдээллийг засах
                                    хүсэлтийг нэг л удаа хийнэ!.
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-600px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "languageAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Туслах сан: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ГАДААД ХЭЛ
                                    </strong>{" "}
                                    цэс дээр дарж “Гадаад хэлний” шалгалтын
                                    төрлүүдийг оруулна.
                                    <br />
                                    <br />
                                    Оруулга: : <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮНДСЭН
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Гадаад хэлний оноо
                                    </strong>{" "}
                                    туслах цэс дээр дарж Энхийг дэмжих
                                    ажиллагаанд үүрэг гүйцэтгэхээр болсон
                                    ЦАХ-ийг харна.
                                    <br />
                                    -Гадаад хэлний шалгалтын оноотой ЦАХ-ийн
                                    шалгалтын оноог оруулна.
                                    <br />
                                    <br />
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-600px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "sportAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Туслах сан: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        НОРМАТИВЫН ТӨРӨЛ
                                    </strong>{" "}
                                    цэс дээр дарж Энхийг дэмжих ажиллагаанд
                                    үүрэг гүйцэтгэх хүсэлтэй ЦАХ-с авах биеийн
                                    тамирын шалгалтын төрлүүдийг оруулна.
                                    <br />
                                    <br />
                                    Шийдвэрлэх: <br />
                                    Алхам 1.{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ҮНДСЭН
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Биеийн тамирын шалгалт
                                    </strong>{" "}
                                    туслах цэс дээр дарж Энхийг дэмжих
                                    ажиллагаанд үүрэг гүйцэтгэх хүсэлтээ
                                    илгээгээд “Эрүүл мэндийн үзлэгээр тэнцсэн”
                                    ЦАХ-ийг харна.
                                    <br />
                                    -Биеийн тамирын шалгалт өгсөн ЦАХ-ийн
                                    шалгалтын оноог нормативын төрөл тус бүрээр
                                    нь оруулна.
                                    <br />
                                    <br />
                                </h1>
                                <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-650px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "unitAdmin" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1>
                                <h1
                                    // className="text-center"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    <br />
                                    Хэрэглэгч бүртгэх: <br />
                                    Алхам 1. Та{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        ХЭРЭГЛЭГЧ
                                    </strong>{" "}
                                    цэсийн{" "}
                                    <strong
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        Хэрэглэгч бүртгэх
                                    </strong>{" "}
                                    туслах цэс дээр дарж өөрийн харьяа
                                    анги/нэгтгэл/, салбарын ЦАХ-ийг бүртгэнэ.
                                    <br />
                                    <br />
                                </h1>
                                <br /> <br /> <br /> <br />
                            </div>
                        </div>
                    </div>
                )}

                {userType === "unitUser" && (
                    <div className="row">
                        <div className="info-box">
                            <div className="container mt-5">
                                {/* <h1
                                    className="text-center"
                                    style={{
                                        fontSize: "27px",
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    Та Энхийг дэмжих ажиллагааны веб программд
                                    амжилттай нэвтэрлээ.
                                </h1> */}
                                <div>
                                    {localStorage.getItem("whatIsMission") ===
                                        null &&
                                        getMissionType == "" && (
                                            <div className="Choosemain">
                                                <b>
                                                    <h1>
                                                        АЖИЛЛАГАА СОНГОХ ХЭСЭГ
                                                    </h1>
                                                </b>
                                                <ul className="chosers">
                                                    <li className="choser_item">
                                                        <div className="choser">
                                                            <div className="choser_image">
                                                                <img src="images/энх1.jpg" />
                                                            </div>
                                                            <div className="choser_content">
                                                                <h2 className="choser_title">
                                                                    Цэргийн баг
                                                                    ажиллагаанд
                                                                    явах хүмүүс{" "}
                                                                </h2>
                                                                <p className="choser_text"></p>
                                                                <button
                                                                    onClick={() => {
                                                                        handleFirstMenuClick(
                                                                            "contingent"
                                                                        );
                                                                    }}
                                                                    className="btn12 card_btn"
                                                                >
                                                                    Цааш нэвтрэх
                                                                </button>

                                                                {/* <a href="/AnotherHome"> <button onClick={handleFirstMenuClick} className="btn12 card_btn">Цааш нэвтрэх</button></a> */}
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="choser_item">
                                                        <div className="choser">
                                                            <div className="choser_image">
                                                                <img src="images/энх2.jpg" />
                                                            </div>
                                                            <div className="choser_content">
                                                                <h2 className="choser_title">
                                                                    Ажиглагч
                                                                    офицер болон
                                                                    штабын
                                                                    офицер
                                                                </h2>

                                                                <p className="choser_text"></p>
                                                                <button
                                                                    onClick={() => {
                                                                        handleFirstMenuClick(
                                                                            "observe"
                                                                        );
                                                                    }}
                                                                    className="btn12 card_btn"
                                                                >
                                                                    Цааш нэвтрэх
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                </div>
                                {/* <img
                                    src={GsmafLogo}
                                    alt="Зэвсэгт хүчний Жанжин штаб"
                                    className="brand-image"
                                    style={{
                                        borderRadius: "1px",
                                        width: "600px",
                                        height: "610px",
                                        marginTop: "-290px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        marginLeft: "370px",
                                        opacity: 0.1,
                                    }}
                                /> */}
                                <br /> <br /> <br /> <br />
                            </div>
                        </div>
                    </div>
                )}
            </>
        </>
    );
};

export default Home;
