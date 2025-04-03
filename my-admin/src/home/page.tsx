import {
  useNavigate,
  // BrowserRouter as Router,
  //   Routes,
  //   Route,
} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("form submitted!");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("welcome ", user);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`${errorCode} ${errorMessage}`);
        console.log(`${errorCode} ${errorMessage}`);
      });
  }

  return (
    <div>
      <section className="flex flex-col items-center justify-center">
        <p className="text-4xl my-10">LOGIN</p>
        <div className="w-[20rem]">
          <form
            id="authForm"
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2.5"
          >
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 "
            ></input>

            <input
              type="password"
              value={password}
              placeholder="pw"
              onChange={(e) => setPassword(e.target.value)}
              className="border "
            ></input>
            <button type="submit" className="border border-gray-300">
              submit
            </button>
          </form>
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </section>
    </div>
  );
}
