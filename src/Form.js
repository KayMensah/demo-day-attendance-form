import { useState } from "react";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "./Firebase";
import { Circle } from "better-react-spinkit";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
    const [id, setId] = useState("");
    const [time, settime] = useState("login");
    const [loading, setLoading] = useState(false);
    const notify = (error, theme) =>
        toast[theme](error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            closeButton: false,
        });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        let day = moment().format("dddd");
        let fullDate = moment().format("LL");
        if (day == "Sunday") {
            return notify(
                "Work on sunday are considered overtime!!",
                "error",
                {}
            );
        }
        if (!id) {
            return notify("Please Enter Your ID 😒", "error", {});
        }
        const ref = collection(db, "logins");
        const q = query(
            ref,
            where("fullDate", "==", fullDate),
            where("user", "==", doc(db, "users", id)),
            where("type", "==", time)
        );
        try {
            const docSnap = await getDoc(doc(db, "users", id));

            if (!docSnap.exists()) {
                setLoading(false);
                return notify("No Such User 😒", "error");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

        let user = [];

        try {
            const isAlready = await getDocs(q);
            isAlready.forEach((doc) => {
                user.push(doc.data());
            });
            if (user.length > 0) {
                setLoading(false);
                return notify(`User Already ${time} 😒`, "error");
            }
        } catch (error) {
            setLoading(false);

            console.log(error);
        }

        await add(ref, time, id, day, notify, setId, setLoading);
    };

    return (
        <>
            {" "}
            <ToastContainer />
            <section>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            {" "}
                            Enter your ID:
                            <input
                                type="text"
                                value={id}
                                onChange={(event) =>
                                    setId(event.target.value.toUpperCase())
                                }
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Log type:
                            <select onChange={(e) => settime(e.target.value)}>
                                <option value="login">Login</option>
                                <option value="logout">Log out</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading && (
                                <Circle
                                    color="white"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                />
                            )}
                            {!loading && time}
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default Form;

async function add(ref, time, id, day, notify, setId, setLoading) {
    try {
        await addDoc(ref, {
            type: time,
            fullDate: moment().format("MMMM D, YYYY"),
            user: doc(db, "users", id),
            time: serverTimestamp(),
            day: day,
            month: moment().format("MMM"),
            year: moment().format("YYYY"),
        });

        notify(`successfully ${time}`, "success");
        setId("");
        setLoading(false);
    } catch (error) {
        setLoading(false);
        notify("please check your network", "error");

        console.log(error);
    }
}
