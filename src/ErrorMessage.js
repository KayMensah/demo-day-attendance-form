import React from "react";
import toast, { Toaster } from "react-hot-toast";

const ErrorMessage = ({ message }) => {
    return toast.error(`${message}`);
};

export default ErrorMessage;
