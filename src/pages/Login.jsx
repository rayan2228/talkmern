import React, { useState } from "react";
// import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import bannerReg from "../assets/bannerreg.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { LineWave } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const auth = getAuth();
  let navigate = useNavigate();

  let [regData, setRegData] = useState({
    email: "",
    password: "",
  });
  let [regError, setRegError] = useState({
    email: "",
    password: "",
  });

  let [openeye, setOpenEye] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
    setRegError({ ...regError, [e.target.name]: "" });
  };

  let handleSubmit = () => {
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regData.email) {
      setRegError({ ...regError, email: "Email Required" });
    } else if (!pattern.test(regData.email)) {
      setRegError({ ...regError, email: "Valid Email Required" });
    } else if (!regData.password) {
      setRegError({ ...regError, password: "Password Required" });
    } else if (regData.password.length < 6) {
      setRegError({ ...regError, password: "Password must be greater then 6" });
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, regData.email, regData.password)
        .then((userCredential) => {
          console.log(userCredential.user.emailVerified);
          setLoading(false);
          if (!userCredential.user.emailVerified) {
            toast.error("Please verify your email first", {
              position: "bottom-center",
              autoClose: 5000,
              theme: "dark",
            });
          } else {
            toast.success("Login Successful", {
              position: "bottom-center",
              autoClose: 5000,
              theme: "dark",
            });
            navigate("/home/feed");
          }
        })
        .catch((error) => {
          setLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.message);
          if (error.message.includes("auth/invalid-credential")) {
            setRegError({ ...regError, email: "Ivalid Credencial" });
          }
        });
    }
  };
  return (
    <Grid container spacing={4}>
      <Grid xs={6}>
        <div className="regbox">
          <h1 style={{ marginTop: "150px" }}>Get started with easily login</h1>
          <div className="passwordeye">
            <TextField
              name="email"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              onChange={handleChange}
            />
          </div>
          {regError.email && <Alert severity="error">{regError.email}</Alert>}
          <div className="passwordeye">
            <TextField
              name="password"
              type={openeye ? "text" : "password"}
              id="outlined-basic"
              label="Password"
              variant="outlined"
              onChange={handleChange}
            />
            {openeye && (
              <FaRegEyeSlash
                onClick={() => setOpenEye(!openeye)}
                className="eye"
              />
            )}
            {!openeye && (
              <FaRegEye onClick={() => setOpenEye(!openeye)} className="eye" />
            )}
          </div>

          {regError.password && (
            <Alert severity="error">{regError.password}</Alert>
          )}
          {!loading && (
            <Button disabled={false} onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          )}
          {loading && (
            <LineWave
              visible={true}
              height="50"
              width="100"
              color="#4fa94d"
              ariaLabel="line-wave-loading"
            />
          )}
          <br />
          <Link to="/forgotpass">Forgot Password?</Link>
          <p>
            Don't have an account? <Link to="/">Create account</Link>{" "}
          </p>
        </div>
      </Grid>
      <Grid xs={6}>
        <img className="bannerImage" src={bannerReg} />
      </Grid>
    </Grid>
  );
};

export default Login;
