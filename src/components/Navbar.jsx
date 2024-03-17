import React, { useState } from "react";
import profile from "../assets/profile.png";
import { FaHome } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Navbar = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  return (
    <div className="navbox">
      <img src={profile} />
      <br />
      <FaHome className="icon" />
      <br />
      <FaMessage className="icon" />
      <br />
      <FiLogOut onClick={handleOpen} className="icon" />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Logout
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button onClick={handleLogout} variant="contained">
              Confirm
            </Button>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Cancel
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
