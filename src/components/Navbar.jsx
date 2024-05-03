import React, { useState, createRef } from "react";
import profile from "../assets/profile.png";
import { FaHome } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlice";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

// import "./Demo.css";

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
  const storage = getStorage();
  let diapatch = useDispatch();

  let location = useLocation();
  let dispatch = useDispatch();

  let userInfo = useSelector((state) => state.user.value);

  console.log(userInfo);

  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [secondModal, setSecondModal] = React.useState(false);

  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpen2 = () => setSecondModal(true);
  const handleClose2 = () => setSecondModal(false);

  let handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        dispatch(activeUser(null));
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  let handleImageUpload = (e) => {
    let files = e.target.files;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const getCropData = () => {
    const storageRef = ref(storage, `profile-${userInfo.uid}`);

    const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
    uploadString(storageRef, message4, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log("File available at", downloadURL);
        updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        }).then(() => {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...userInfo, photoURL: downloadURL })
          );
          diapatch(activeUser({ ...userInfo, photoURL: downloadURL }));
        });
      });
    });
  };

  return (
    <div className="navbox">
      <div
        onClick={handleOpen2}
        style={{
          width: "85px",
          height: "85px",
          margin: "0 auto",
          cursor: "pointer",
        }}
      >
        <img
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          src={userInfo.photoURL}
        />
      </div>
      <h1 style={{ fontSize: "16px", textAlign: "center" }}>
        {userInfo.displayName}
      </h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Link
          className={location.pathname == "/home/feed" && "active"}
          to="/home/feed"
        >
          <FaHome className="icon" />
        </Link>

        <br />
        <Link
          className={location.pathname == "/home/message" && "active"}
          to="/home/message"
        >
          <FaMessage className="icon" />
        </Link>
        <br />
        <FiLogOut onClick={handleOpen} className="icon" />
      </div>

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

      <Modal
        open={secondModal}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Profile Upload
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {image && (
              <div className="box" style={{ width: "50%", float: "left" }}>
                <h1>Preview</h1>
                <div
                  className="img-preview"
                  style={{ width: "100%", float: "left", height: "300px" }}
                />
              </div>
            )}
            <input onChange={handleImageUpload} type="file" />
            {image && (
              <>
                <Cropper
                  ref={cropperRef}
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                />
                <Button onClick={getCropData} variant="contained">
                  Upload
                </Button>
              </>
            )}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
