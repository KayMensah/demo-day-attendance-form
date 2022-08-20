import { useState } from "react";

const Form = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`the email you entered was: ${email}`);
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
