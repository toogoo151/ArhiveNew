import React, { useState, useRef } from "react";
import CKEditor from "ckeditor4-react-advanced";
import Modal from "react-modal";
import axios from "../../../AxiosUser";
import AlertSuccess from "../General/Alert/AlertSuccess";
import AlertError from "../General/Alert/AlertError";

const LegalNew = (props) => {
    const [pdf, setPdf] = useState(null);
    const [title, setTitle] = useState(null);
    const [comment, setComment] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const newWindow = useRef(window);

    const openWindow = () => {
        newWindow.current = window.open(
            "/laravel-filemanager",
            "",
            "width=600,height=400,left=200,top=200"
        );
    };

    window.SetUrl = (url, width, height, alt) => {
        console.log(url);
        setPdf(url[0].url);
    };

    const changeTitle = (e) => {
        setTitle(e.target.value);
    };

    const onEditorStateChange = (editor) => {
        setComment(editor.editor.getData());
    };

    const clickSendRequest = () => {
        if (title == null || title == "") {
            alert("Гарчигаа оруулна уу.");
            return;
        }
        setErrorMsg(null);
        setSuccessMsg(null);
        axios
            .post("/legal/new", {
                _token: document.querySelector('meta[name="csrf-token"]'),
                sub: props.subId,
                title: title,
                comment: comment,
                pdf: pdf,
            })
            .then((res) => {
                console.log(res.data);
                setSuccessMsg(res.data.msg);
                setErrorMsg(null);
                setComment(null);
                setTitle(() => "");
                setPdf(null);
            })
            .catch((err) => {
                setErrorMsg(err.response.data.msg);
                setSuccessMsg(null);
            })
            .finally();
    };

    return (
        <div className="col-md-8">
            {pdf}
            <div className="form-group">
                <input
                    type="button"
                    className="btn btn-info"
                    value="Pdf файл сонгох"
                    onClick={openWindow}
                />
            </div>
            <div className="form-group">
                <label>Гарчиг:</label>
                <input
                    type="text"
                    className="form-control"
                    onChange={changeTitle}
                    value={title}
                />
            </div>
            <div className="form-group">
                <label>Мэдээлэл: {props.subId}</label>
                <CKEditor
                    data={comment}
                    // onChange={this.onEditorChange}
                    filebrowserImageBrowseUrl="/laravel-filemanager?type=Images"
                    filebrowserImageUploadUrl="/laravel-filemanager/upload?type=Images&_token="
                    filebrowserBrowseUrl="/laravel-filemanager?type=Files"
                    filebrowserUploadUrl="/laravel-filemanager/upload?type=Files&_token="
                    onChange={onEditorStateChange}
                    config={{
                        filebrowserImageBrowseUrl:
                            "/laravel-filemanager?type=Images",
                        filebrowserImageUploadUrl:
                            "/laravel-filemanager/upload?type=Images&_token=",
                        filebrowserBrowseUrl: "/laravel-filemanager?type=Files",
                        filebrowserUploadUrl:
                            "/laravel-filemanager/upload?type=Files&_token=",
                    }}
                />
            </div>
            <div className="form-group">
                <button className="btn btn-success" onClick={clickSendRequest}>
                    Хүсэлт илгээх
                </button>
            </div>
            <div className="form-group">
                {successMsg && <AlertSuccess msg={successMsg} />}
                {errorMsg && <AlertError msg={errorMsg} />}
            </div>
        </div>
    );
};

export default LegalNew;

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};
