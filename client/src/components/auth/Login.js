/**
 * This is a React component for a login form that handles user input validation and authentication
 * using axios and Redux.
 * @returns The Login component is being returned.
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";

import ErrorMessage from "./ErrorMessage";
import SubmitBtn from "./SubmitBtn";
import { addToken } from "../../actions/authActions";
import { loadUserInfo } from "../../actions/userActions";
import "./Auth.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && password) {
      if (email.match(/.+@.+\....+/)) {
        setMessage("");
        try {
          const response = await axios.post("https://battleship-server.vercel.app/login", { email, password });
          if (response.data) {
            dispatch(addToken(response.data.token));
            dispatch(loadUserInfo(response.data));
            localStorage.setItem("token", response.data.token);
            navigate("/");
          } else {
            setMessage("Email and/or password is incorrect");
          }
        } catch (error) {
          setMessage("Email and/or password is incorrect");
        }
      } else {
        setMessage("Please enter a valid email address");
      }
    } else {
      setMessage("Please fill out all fields");
    }
  };

  return (
    <div className="background">
      <div className="header">
        <Header style={{ fontSize: "58px" }} />
      </div>
      <div className="form-container">
        <Form className="login-form rounded shadow p-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {message && <ErrorMessage message={message} />}
          <SubmitBtn
            text="Log In"
            message={message}
            handleClick={handleSubmit}
          />
          <div>
            <span>Don't have an account? </span>
            <Link to="/register">Register here</Link>
          </div>
        </Form>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
