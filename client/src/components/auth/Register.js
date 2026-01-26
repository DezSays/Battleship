/**
 * The Register function is a React component that handles user registration by sending a POST request
 * to the server and displaying error messages if necessary.
 * @returns The Register component is being returned, which contains a form for user registration.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";

import SubmitBtn from "./SubmitBtn";
import ErrorMessage from "./ErrorMessage";
import "./Auth.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && password && name && confirmPassword) {
      if (!email.match(/.+@.+\....+/)) {
        setMessage("Please enter a valid email address");
      } else if (password !== confirmPassword) {
        setMessage("Confirmation password does not match");
      } else {
        setMessage("");
        try {
          const response = await axios.post("https://battleship-server.vercel.app/register", {
            email,
            password,
            name,
          });
          console.log(response.status);
          if (response.status === 200) {
            navigate("/login");
          } else if (response.status === 204) {
            setMessage("That email already exists");
          } else {
            setMessage("Server error... please try again later");
          }
        } catch (error) {
          setMessage("Server error... please try again later");
        }
      }
    } else {
      setMessage("Please fill out all input fields");
    }
  };

  return (
    <div className="background">
      <div className="header">
        <Header style={{ fontSize: "58px" }} />
      </div>
      <div className="form-container">
        <Form className="login-form rounded shadow p-3">
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
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
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          {message && <ErrorMessage message={message} />}
          <SubmitBtn
            text="Register"
            message={message}
            handleClick={handleSubmit}
          />
        </Form>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Register;
