import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./Firebase";

const Form = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`the email you entered was: ${email}`);

    const docRef = collection(doc(db, "users", email), "logins");
    const update = await addDoc(docRef, {
      time: serverTimestamp(),
    });

    console.log(update);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label> Enter your email</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input type="submit" />
    </form>
  );
};

export default Form;
