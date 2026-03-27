import { ProgressBar } from "react-loader-spinner";

const Spinner = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            <ProgressBar
                height="60"
                width="60"
                color="#0c284f"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                borderColor="#1a7fba"
                barColor="#0c2d5c"
            />
        </div>
    );
};

export default Spinner;
