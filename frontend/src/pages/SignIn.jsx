/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/loadEnv";
import "./styles/Signup.css";
import { Link, useNavigate } from "react-router-dom";

const SignIn = ({ setIsLoggedIn }) => {
  const userInfo = {
    username: useRef(),
    password: useRef(),
  };
  const [isvalidPassword, setIsvalidPassword] = useState(true);
  const navigate = useNavigate();

  const handleValidPassword = (e) => {
    const newPassword = e.target.value;
    if (newPassword.length < 6) {
      setIsvalidPassword(false);
    } else {
      setIsvalidPassword(true);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isvalidPassword) return;
    const User = {
      username: userInfo.username.current.value,
      password: userInfo.password.current.value,
    };
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/user/signin`,
        User
      );
      localStorage.setItem("authtoken", response.data.token);
      userInfo.username.current.value = "";
      userInfo.password.current.value = "";
      setIsLoggedIn(true);
      navigate("/user/chat");
    } catch (e) {
      alert(e.response.data.message);
    }
  };
  return (
    <form onSubmit={handleSignIn} className="signupForm">
      <div className="flex">
        <label htmlFor="username">Username</label>
        <input ref={userInfo.username} type="email" id="username" required />
      </div>
      <div className="flex">
        <label htmlFor="password">Password</label>
        <input
          ref={userInfo.password}
          onChange={handleValidPassword}
          type="password"
          id="password"
          required
        />
        <div className="text-red-500">
          {isvalidPassword ? "" : "Password must be atleast 6 characters long"}
        </div>
      </div>
      <button type="submit">Sign In</button>
      <p>
        Didn&apos;t have an account, <Link to="/signup">Signup now</Link>
      </p>
    </form>
  );
};

export default SignIn;
