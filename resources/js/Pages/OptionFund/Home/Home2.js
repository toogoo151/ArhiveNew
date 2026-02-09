import React, { useEffect, useState } from "react";
import axios from "../../../AxiosUser";
import Swal from "sweetalert2";
import GsmafLogo from "../../../../dist/img/GsmafLogo.png";

import "./Home.css";

const Home2 = () => {
    return (
        <>
            <>
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
                                Хэрэглэгч тавтай морил та энхийг дэмжих
                                ажиллагааны
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
            </>
        </>
    );
};

export default Home2;
