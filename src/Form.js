import { useEffect, useState } from "react";
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
import ErrorMessage from "./ErrorMessage";

const Form = () => {
    let navigate = useNavigate();
    const [error, seterror] = useState("");
    const [id, setId] = useState("");
    const [time, settime] = useState("login");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        let day = moment().format("dddd");

        event.preventDefault();
        let user = [];
        if (!id) {
            seterror("Please Enter Your ID");
            return;
        }
        const ref = collection(db, "logins");
        const q = query(
            ref,
            where("fullDate", "==", day),
            where("user", "==", doc(db, "users", id)),
            where("type", "==", time)
        );
        setLoading(true);

        try {
            const docSnap = await getDoc(doc(db, "users", id));

            if (!docSnap.exists()) {
                setLoading(false);
                seterror("No Such User");
                return;
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
            seterror("please check your network");
        }

        try {
            const isAlready = await getDocs(q);
            isAlready.forEach((doc) => {
                user.push(doc.data());
            });
            if (user.length !== 0) {
                seterror(`Already ${time}!!`);
                setLoading(false);

                return;
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
            seterror("please check your network");
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
            // navigate("/success", { replace: true });
        } catch (error) {
            setLoading(false);
            seterror("please check your network");

            console.log(error);
            alert(error);
        }
        setId("");

        setLoading(false);
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                seterror("");
            }, 5000);
        }
    }, [error]);

    return (
        <section>
            {/* <img
                src="https://d39kqat1wpn1o5.cloudfront.net/app/uploads/2019/05/benefits.png"
                alt=""
            /> */}

            <form onSubmit={handleSubmit}>
                <ErrorMessage message={error} />

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
