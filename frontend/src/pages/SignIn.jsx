import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  .sign_in_and_up_div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #757575;
    gap: 0.8rem;
    padding: 1rem;
    min-width: 26%;
    border-radius: 3px;
    .sign_in_and_up_form_div {
      form {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        align-items: center;
        justify-content: center;
        align-items: center;
        input {
          padding: 10px 60px 10px 10px;
          border-radius: 3px;
          border: none;
        }
        button {
          background-color: red;
          color: white;
          border: none;
          padding: 6px 15px;
          border-radius: 4px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
    h4 {
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
    h4:hover {
      color: #8c9eff;
    }
  }
`;

//show toast message function
const showToastMessage = (result, msg) => {
  if (result === true) {
    toast.success(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else {
    toast.error(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

const SignIn = () => {
  const [signInToggler, setSignInToggler] = useState(true);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //useEffect to skip the sign in/sign-up part if user already has the cookie of sign in
  useEffect(() => {
    const result = getAccessTokenCookie();
    if (result) {
      return navigate("/");
    }
  }, []);

  //update input value of form
  const updateValueInput = async (event) => {
    const { placeholder, value } = event.target;
    if (placeholder === "Email") {
      setEmail(value);
    } else if (placeholder === "Username") {
      setUsername(value);
    } else if (placeholder === "Password") {
      setPassword(value);
    } else if (placeholder === "Confirm Password") {
      setConfirmPassword(value);
    }
  };

  //validate input functions
  const validateSignInInput = (email, password) => {
    if (email.length == 0 || password.length == 0) {
      showToastMessage(false, "Please fill in all the inputs");
      return false;
    }
    return true;
  };
  //validate signup input
  const validateSignUpInput = (email, username, password, confirmPassword) => {
    if (email.length < 3) {
      showToastMessage(false, "Email not valid");
      return false;
    }
    if (username.length < 3) {
      showToastMessage(false, "username needs at leats 4 characters");
      return false;
    }
    if (password.length < 8) {
      showToastMessage(false, "Password needs at least 8 characters");
      return false;
    }
    if (password != confirmPassword) {
      showToastMessage(false, "Password and confirm password not match");
      return false;
    }
    return true;
  };
  //function to submit sign in info
  const signInFunction = async (event) => {
    event.preventDefault();
    if (!validateSignInInput(email, password)) {
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:7000/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      showToastMessage(res.data.status, res.data.msg);
      if (res.data.status === true) {
        console.log(res);
        return navigate("/");
      }
    } catch (error) {
      showToastMessage(false, error);
    }
  };
  //function to sign up info
  const signUpFunction = async (event) => {
    event.preventDefault();
    if (!validateSignUpInput(email, username, password, confirmPassword)) {
      return;
    }
    try {
      const res = await axios.post("http://localhost:7000/signup", {
        username,
        email,
        password,
      });
      showToastMessage(res.data.status, res.data.msg);
      if (res.data.status === true) {
        return setSignInToggler(true);
      }
    } catch (error) {
      showToastMessage(false, "Sign up failed. Please try again.");
    }
  };
  //getting the accesstoken cookie function
  const getAccessTokenCookie = () => {
    const allCookie = document.cookie.split(";");
    for (let cookie of allCookie) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName == "access_token") {
        return cookieValue;
        break;
      }
    }
    return null;
  };
  return (
    <Container>
      {signInToggler ? (
        <div className="sign_in_and_up_div">
          <h2>Sign In</h2>
          <div className="sign_in_and_up_form_div">
            <form onSubmit={signInFunction}>
              <input
                onChange={updateValueInput}
                value={email}
                type="email"
                placeholder="Email"
              />
              <input
                onChange={updateValueInput}
                value={password}
                type="password"
                placeholder="Password"
              />
              <button type="submit">SIGN IN</button>
            </form>
          </div>
          <h4
            onClick={() => {
              setSignInToggler(false);
            }}
          >
            Don't have account? Sign Up
          </h4>
        </div>
      ) : (
        <div className="sign_in_and_up_div">
          <h2>Sign Up</h2>
          <div className="sign_in_and_up_form_div">
            <form onSubmit={signUpFunction}>
              <input
                onChange={updateValueInput}
                value={email}
                type="email"
                placeholder="Email"
              />
              <input
                onChange={updateValueInput}
                value={username}
                type="text"
                placeholder="Username"
              />
              <input
                onChange={updateValueInput}
                value={password}
                type="password"
                placeholder="Password"
              />
              <input
                value={confirmPassword}
                type="password"
                placeholder="Confirm Password"
                onChange={updateValueInput}
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <h4
            onClick={() => {
              setSignInToggler(true);
            }}
          >
            Already Have Account? Sign In
          </h4>
        </div>
      )}
      <ToastContainer />
    </Container>
  );
};

export default SignIn;
