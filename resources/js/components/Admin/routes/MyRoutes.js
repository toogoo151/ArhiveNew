import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "../../../Pages/Admin/Admin/Admin";
import PassReset from "../../../Pages/Admin/PassReset/PassReset";

export default function MyRoutes() {
    return (
        <Routes>
            <Route path="a/admin" element={<Admin />} />
            <Route path="a/admin/pass/reset" element={<PassReset />} />
        </Routes>
    );
}
