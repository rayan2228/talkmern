import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const UserList = () => {
  const db = getDatabase();

  let [userList, setUserList] = useState([]);
  let [friendRequest, setFriendRequest] = useState([]);
  let [friend, setFriend] = useState([]);
  let [block, setBlock] = useState([]);

  let userInfo = useSelector((state) => state.user.value);

  console.log();

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      const arr = [];

      snapshot.forEach((item) => {
        if (userInfo.uid !== item.key) {
          arr.push({
            userid: item.key,
            username: item.val().username,
            email: item.val().email,
          });
        }
      });
      setUserList(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friendrequest");
    onValue(userRef, (snapshot) => {
      const arr = [];

      snapshot.forEach((item) => {
        arr.push(item.val().whoreceiveid + item.val().whosendid);
      });
      setFriendRequest(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friends");
    onValue(userRef, (snapshot) => {
      const arr = [];

      snapshot.forEach((item) => {
        arr.push(item.val().whoreceiveid + item.val().whosendid);
      });
      setFriend(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "block");
    onValue(userRef, (snapshot) => {
      const arr = [];

      snapshot.forEach((item) => {
        arr.push(item.val().blockid + item.val().blockbyid);
      });
      setBlock(arr);
    });
  }, []);

  let handleFriendRequest = (item) => {
    set(push(ref(db, "friendrequest/")), {
      whosendid: userInfo.uid,
      whosendname: userInfo.displayName,
      whoreceiveid: item.userid,
      whoreceivename: item.username,
    });
  };

  return (
    <div className="boxcontainer">
      <div className="titleholder">
        <h2>User List</h2>
      </div>

      {userList.map((item) => (
        <div className="box">
          <div className="img">
            <img src={boximg} />
          </div>
          <div className="title">
            <h3>{item.username}</h3>
          </div>
          {friendRequest.includes(item.userid + userInfo.uid) ||
          friendRequest.includes(userInfo.uid + item.userid) ? (
            <Button disabled variant="contained">
              pending
            </Button>
          ) : friend.includes(item.userid + userInfo.uid) ||
            friend.includes(userInfo.uid + item.userid) ? (
            <Button disabled variant="contained">
              Friends
            </Button>
          ) : block.includes(item.userid + userInfo.uid) ||
            block.includes(userInfo.uid + item.userid) ? (
            <Button disabled variant="contained">
              Block
            </Button>
          ) : (
            <Button
              onClick={() => handleFriendRequest(item)}
              variant="contained"
            >
              +
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
