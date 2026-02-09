import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import axios from "../../../AxiosUser";

import AsideMenu from "../../../components/User/Layouts/asideMenu/AsideMenu";
import HeaderMenu from "../../../components/User/Layouts/header/HeaderMenu";
import Footer from "../../../components/User/Layouts/footer/Footer";
import Content from "../../../components/User/Layouts/content/Content";
import Slider from "../../../components/User/Layouts/slider/Slider";
import Url from "../../../components/User/Layouts/url/Url";
import CointNumber from "../../../components/User/Layouts/countNumber/CountNumber";

// reducers
import HeaderMenuReducer from "../../../redux/useradmin/reducers/HeaderMenuReducer";
import ReportMontly from "../../../components/User/ReportMontly/ReportMontly";
import ReportYear from "../../../components/User/ReportYear/ReportYear";
// import SubMenuReducer from "../../../redux/useradmin/reducers/SubMenuReducer";

const loggerMiddlaware = (store) => {
    return (next) => {
        return (action) => {
            console.log("MyLoggerMiddleware: Dispatching ==> ", action);
            console.log(
                "MyLoggerMiddleware: State BEFORE : ",
                store.getState()
            );
            const result = next(action);
            console.log("MyLoggerMiddleware: State AFTER : ", store.getState());
            return result;
        };
    };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({ HeaderMenuReducer });

const middlewares = [loggerMiddlaware, thunk];

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares))
);

function App() {
    const [getLegalsNotification, setgetLegalsNotification] = useState([]);
    useEffect(() => {
        axios
            .get("/user/info")
            .then((res) => {
                localStorage.setItem("admin", res.data.permission);
                localStorage.setItem("name", res.data.name);
                localStorage.setItem("userType", res.data.user_type);
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            });
        axios
            .get("/get/legal/notification")
            .then((response) => {
                setgetLegalsNotification(response.data);
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            });
    }, []);
    return (
        <div>
            <Provider store={store}>
                <BrowserRouter>
                    {/* <AsideMenu /> */}

                    <Routes>
                        <Route
                            path="/welcome"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <Slider />
                                </>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <Slider />
                                </>
                            }
                        />
                        {/* <Route path="/:headerId" element={<AsideMenu />} /> */}
                        <Route
                            path="/post/:headerId"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <Url />
                                    <Content />
                                </>
                            }
                        />
                        <Route
                            path="/post/:headerId/:sideId"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <Url />
                                    <Content />
                                    {/* <SubMenu /> */}
                                </>
                            }
                        />
                        <Route
                            path="/post/:headerId/:sideId/:subId"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <Url />
                                    <Content />
                                </>
                            }
                        />

                        <Route
                            path="/report/montly"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <ReportMontly />
                                </>
                            }
                        />
                        <Route
                            path="/report/year"
                            element={
                                <>
                                    <HeaderMenu
                                        getLegalsNotification={
                                            getLegalsNotification
                                        }
                                    />
                                    <ReportYear />
                                </>
                            }
                        />
                    </Routes>

                    <CointNumber />
                    <Footer />
                </BrowserRouter>
            </Provider>
        </div>
    );
}

export default App;

if (document.getElementById("frontend_body_content")) {
    ReactDOM.render(<App />, document.getElementById("frontend_body_content"));
}
