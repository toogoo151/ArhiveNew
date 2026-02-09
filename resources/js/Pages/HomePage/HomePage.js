import { ReactTyped } from "react-typed";

const HomePage = () => {
  return (
    <>
     <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          <ReactTyped
            strings={["Here you can find anything"]}
            typeSpeed={50}
          />
        </h1>
        <p className="lead text-muted mt-3">
          Explore our products, categories, and brands
        </p>
      </div>

      {/* Search Section */}
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="input-group input-group-lg shadow-sm">
            <ReactTyped
              strings={[
                "Search for products",
                "Search for categories",
                "Search for brands",
              ]}
              typeSpeed={50}
              backSpeed={40}
              attr="placeholder"
              loop
            >
              <input
                type="text"
                className="form-control rounded-start"
                aria-label="Search"
              />
            </ReactTyped>
            <button className="btn btn-primary rounded-end" type="button">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Optional Footer / Info */}
      <div className="text-center mt-5 text-muted">
        &copy; 2026 Your Company. All rights reserved.
      </div>
    </div>
   </>
  );
};

export default HomePage
