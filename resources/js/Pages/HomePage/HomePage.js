import { ReactTyped } from "react-typed";
import "./HomePage.css"; // change path if needed
import bg from "../../../img/Back.jpg"; // change path if needed

const HomePage = () => {
  return (
    <div
      className="homepage d-flex align-items-center justify-content-center text-white"
       style={{ backgroundImage: `url(${bg})` }}>

      {/* Content */}
      <div className="container text-center" style={{ zIndex: 2 }}>
        {/* Hero */}
        <h1 className="display-4 fw-bold mb-4">
          <ReactTyped
            strings={[
              "Архивын программд тавтай морил!",
              "...........................",

            ]}
            typeSpeed={60}
            backSpeed={40}
            loop
          />
        </h1>

        <p className="lead mb-5 text-light">
          Secure • Centralized • Military Archive Management
        </p>

        {/* Search */}
        {/* <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="input-group input-group-lg shadow">
              <ReactTyped
                strings={[
                  "Байнга хадгалагдах баримт хайх...",
                  "Тушаал хайх...",
                  "Баримт бичиг хайх...",
                ]}
                typeSpeed={50}
                backSpeed={40}
                attr="placeholder"
                loop
              >
                <input
                  type="text"
                  className="form-control"
                />
              </ReactTyped>

              <button className="btn btn-primary">
                Search
              </button>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="mt-5 small text-light opacity-75">
          ZEV platform
        </div>
      </div>
    </div>
  );
};

export default HomePage;
