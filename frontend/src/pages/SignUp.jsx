/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/loadEnv";
import "./styles/Signup.css";
import { Link, useNavigate } from "react-router-dom";

const SignUp = ({ setIsLoggedIn }) => {
  const userInfo = {
    username: useRef(),
    password: useRef(),
    firstName: useRef(),
    lastName: useRef(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isvalidPassword) return;
    const newUser = {
      username: userInfo.username.current.value,
      password: userInfo.password.current.value,
      firstName: userInfo.firstName.current.value,
      lastName: userInfo.lastName.current.value,
    };
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/user/signup`,
        newUser
      );
      localStorage.setItem("authtoken", response.data.token);
      userInfo.username.current.value = "";
      userInfo.password.current.value = "";
      userInfo.firstName.current.value = "";
      userInfo.lastName.current.value = "";
      setIsLoggedIn(true);
      navigate("/user/chat");
    } catch (e) {
      console.log("Error while signing up:", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signupForm">
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
      <div className="flex">
        <label htmlFor="firstName">FirstName</label>
        <input ref={userInfo.firstName} type="text" id="firstName" required />
      </div>
      <div className="flex">
        <label htmlFor="lastName">LastName</label>
        <input ref={userInfo.lastName} type="text" id="lastName" required />
      </div>
      <button type="submit">Sign Up</button>
      <p>
        Already have an account, <Link to="/signin">Signin now</Link>
      </p>
    </form>
  );
};

export default SignUp;
