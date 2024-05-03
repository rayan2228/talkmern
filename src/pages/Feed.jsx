import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import GroupList from "../components/GroupList";
import FriendRequest from "../components/FriendRequest";
import Friends from "../components/Friedns";
import MyGroup from "../components/MyGroup";
import UserList from "../components/UserList";
import BlockUser from "../components/BlockUser";

const Feed = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <GroupList />
          <FriendRequest />
        </Grid>
        <Grid item xs={4}>
          <Friends />
          <MyGroup />
        </Grid>
        <Grid item xs={4}>
          <UserList />
          <BlockUser />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Feed;
