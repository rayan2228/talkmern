import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Home = () => {
  let data = useSelector((state) => state?.user?.value);
  let navigate = useNavigate();

  useEffect(() => {
    if (!data?.email) {
      navigate("/login");
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid h1 xs={2}>
          <Navbar />
        </Grid>
        <Grid h1 xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
