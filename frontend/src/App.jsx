import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import SignUp from "./pages/SignUp";
import UserChat from "./pages/UserChat";
import SignIn from "./pages/SignIn";
import "./App.css";
import NotFound from "./components/NotFound";

const App = () => {
  const [isloggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("authtoken") ? true : false
  );

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            isloggedIn ? (
              <UserChat setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/signin" replace={true} />
            )
          }
        />
        <Route
          path="/user/chat"
          element={
            isloggedIn ? (
              <UserChat setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/signin" replace={true} />
            )
          }
        />
        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signin"
          element={<SignIn setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
