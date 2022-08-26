import { useState } from "react";
import {
    addDoc,
    collection,
    doc,
    DocumentSnapshot,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "./Firebase";
import { Circle } from "better-react-spinkit";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Form = () => {
    let day = moment().format("dddd");
    const month = moment().format("MMMM");
    let navigate = useNavigate();
    const [id, setId] = useState("");
    const [time, settime] = useState("login");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!id) return alert("input employee id");
        setLoading(true);
        const ref = collection(db, "logins");
        // const docref = doc(db, "users", id, "logins", month);
        const docSnap = await getDoc(doc(db, "users", id));

        if (!docSnap.exists()) {
            setLoading(false);
            return alert("no such user");
        }
        try {
            await addDoc(
                ref,

                {
                    type: time,
                    user: doc(db, "users", id),
                    time: serverTimestamp(),
                    day: day,
                    month: moment().format("MMM"),
                    year: moment().format("YYYY"),
                }
            );

            navigate("/success", { replace: true });
        } catch (error) {
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
