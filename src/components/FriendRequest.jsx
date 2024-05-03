import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const db = getDatabase();

  let [reqList, setReqList] = useState([]);
  let userInfo = useSelector((state) => state.user.value);
  useEffect(() => {
    const friendRequestRef = ref(db, "friendrequest");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        console.log(userInfo.uid, item.val().whoreceiveid);
        if (userInfo.uid == item.val().whoreceiveid) {
          arr.push({
            ...item.val(),
            id: item.key,
          });
        }
      });

      setReqList(arr);
    });
  }, []);

  let handleFriendAccept = (item) => {
    console.log(item);

    set(push(ref(db, "friends/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendrequest/" + item.id));
    });
  };

  let handleDelete = (id) => {
    remove(ref(db, "friendrequest/" + id));
  };

  return (
    <div className="boxcontainer" style={{ marginTop: "50px" }}>
      <div className="titleholder">
        <h2>Friend Request</h2>
      </div>
      {reqList.map((item) => (
        <div className="box">
          <div className="img">
            <img src={boximg} />
          </div>
          <div className="title">
            <h3>{item.whosendname}</h3>
          </div>
          <Button onClick={() => handleFriendAccept(item)} variant="contained">
            Accept
          </Button>
          <Button
            onClick={() => handleDelete(item.id)}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FriendRequest;
