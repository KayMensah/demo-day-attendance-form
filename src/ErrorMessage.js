import React from "react";
const ErrorMessage = ({ message }) => {
    return (
        <div className={`${!message ? "remove" : "add"} error`}>
            <section>
                <p>{message}</p>
            </section>
        </div>
    );
};

export default ErrorMessage;
