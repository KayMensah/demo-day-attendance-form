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
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Form = () => {
    let day = moment().format("dddd");
    let navigate = useNavigate();
    const [id, setId] = useState("");
    const [time, settime] = useState("login");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        let day = moment().format("MMMM D, YYYY");

        event.preventDefault();
        let user = [];
        if (!id) return alert("input employee id");
        setLoading(true);
        const ref = collection(db, "logins");
        const q = query(
            ref,
            where("fullDate", "==", day),
            where("user", "==", doc(db, "users", id)),
            where("type", "==", time)
        );
        const isAlready = await getDocs(q);
        const docSnap = await getDoc(doc(db, "users", id));
        isAlready.forEach((doc) => {
            user.push(doc.data());
        });
        console.log(user);
        if (!docSnap.exists()) {
            setLoading(false);
            return alert("no such user");
        }
        if (user.length !== 0) {
            alert("already exist!!");
            setLoading(false);

            return;
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
            navigate("/success", { replace: true });
        } catch (error) {
            setLoading(false);

            console.log(error);
            alert(error);
        }
        setId("");

        setLoading(false);
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    {" "}
                    Enter your ID:
                    <input
                        type="text"
                        value={id}
                        onChange={(event) => setId(event.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Log type:
                    <select onChange={(e) => settime(e.target.value)}>
                        <option value="login">Login</option>
                        <option value="logout">Login out</option>
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
    );
};

export default Form;
