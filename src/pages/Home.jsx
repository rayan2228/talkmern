import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
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
