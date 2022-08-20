import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";

const Form = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`the email you entered was: ${email}`);

    const docRef = doc(db, "users");

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
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
