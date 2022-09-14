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
import toast, { Toaster } from "react-hot-toast";

const Form = () => {
    const [id, setId] = useState("");
    const [time, settime] = useState("login");
    const [loading, setLoading] = useState(false);
    const notify = (error, theme) =>
        toast[theme](error, {
            duration: 4000,
            position: "top-center",
            // iconTheme: {
            //     primary: "#000",
            //     secondary: "#fff",
            // },
        });

    const handleSubmit = async (event) => {
        let day = moment().format("dddd");
        let fullDate = moment().format("LL");

        event.preventDefault();
        let user = [];
        if (!id) {
            return notify("Please Enter Your ID", "error");
        }
        const ref = collection(db, "logins");
        const q = query(
            ref,
            where("fullDate", "==", fullDate),
            where("user", "==", doc(db, "users", id)),
            where("type", "==", time)
        );
        setLoading(true);

        try {
            const docSnap = await getDoc(doc(db, "users", id));

            if (!docSnap.exists()) {
                setLoading(false);

                return notify("No Such User", "error");
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
            notify("please check your network", "error");
        }

        try {
            const isAlready = await getDocs(q);
            isAlready.forEach((doc) => {
                user.push(doc.data());
            });
            if (user.length !== 0) {
                setLoading(false);

                return notify(`Already ${time}!!`, "error");
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
            notify("please check your network", "error");
        }

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
    };

    return (
        <section>
            <Toaster />
            <form onSubmit={handleSubmit} className="h-screen">
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
    );
};

export default Form;
