import ReactDOM from "react";
import "./footer.css"

export default function Footer() {
    return (
       <footer className="main-footer">
    <small>
        Зэвсэгт хүчний <strong>Программ хангамжийн төв</strong> хөгжүүлэв © 2026
        — Бүх эрх хуулиар хамгаалагдсан
    </small>
</footer>
    );
}

if (document.getElementById("footer")) {
    ReactDOM.render(<Footer />, document.getElementById("footer"));
}
