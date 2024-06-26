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
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { LineWave } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

import Glogin from "../assets/Google.png";

import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();

  let [regData, setRegData] = useState({
    email: "",
    name: "",
    password: "",
  });
  let [regError, setRegError] = useState({
    email: "",
    name: "",
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
    } else if (!regData.name) {
      setRegError({ ...regError, name: "Name Required" });
    } else if (!regData.password) {
      setRegError({ ...regError, password: "Password Required" });
    } else if (regData.password.length < 6) {
      setRegError({ ...regError, password: "Password must be greater then 6" });
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, regData.email, regData.password)
        .then((userCredential) => {
          console.log(userCredential);
          updateProfile(auth.currentUser, {
            displayName: regData.name,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/talkmern.appspot.com/o/avatar%2Fistockphoto-1300845620-612x612.jpg?alt=media&token=fc1820f4-91b3-47f9-b71b-848ee791f2ad",
          })
            .then(() => {
              set(ref(db, "users/" + userCredential.user.uid), {
                username: regData.name,
                email: regData.email,
                photoURL: userCredential.user.photoURL,
              });
            })
            .then(() => {
              setLoading(false);
              sendEmailVerification(auth.currentUser).then(() => {
                toast.success(
                  "Registration Successful, Please check your email for verification",
                  {
                    position: "bottom-center",
                    autoClose: 5000,
                    theme: "dark",
                  }
                );
                navigate("/login");
              });
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });

          console.log("usercreated", userCredential);
        })
        .catch((error) => {
          setLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          if (error.message.includes("email-already-in-use")) {
            setRegError({ ...regError, email: "Email already exists" });
          }
        });
    }
  };

  let handleGlogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        toast.success("Registration Successful", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "dark",
        });
        navigate("/home/feed");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={4}>
      <Grid xs={6}>
        <div className="regbox">
          <h1 style={{ marginTop: "150px" }}>
            <img onClick={handleGlogin} src={Glogin} /> <br />
            Get started with easily register
          </h1>
          <p>Free register and you can enjoy it</p>
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
              name="name"
              id="outlined-basic"
              label="Name"
              variant="outlined"
              onChange={handleChange}
            />
          </div>
          {regError.name && <Alert severity="error">{regError.name}</Alert>}
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

          <p>
            Alredy have an account? <Link to="/login">Login</Link>{" "}
          </p>
        </div>
      </Grid>
      <Grid xs={6}>
        <img className="bannerImage" src={bannerReg} />
      </Grid>
    </Grid>
  );
};

export default Registration;
