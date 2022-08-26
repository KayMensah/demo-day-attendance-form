import React from "react";
import { Routes, Route } from "react-router-dom";
import Form from "./Form";
import Success from "./Success";
const Router = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Form />} />
                <Route path="/success" element={<Success />} />
            </Routes>
        </div>
    );
};

export default Router;
