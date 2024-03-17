import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const auth = getAuth();
  let [value, setValue] = useState("");

  let handleClick = () => {
    sendPasswordResetEmail(auth, value)
      .then(() => {
        toast.success("Please check your email", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "dark",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <div className="forgotbox">
      <div className="containbox">
        <h4>Forgot Password</h4>
        <TextField
          onChange={(e) => setValue(e.target.value)}
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <Button onClick={handleClick} variant="contained">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
