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

const Friedns = () => {
  const db = getDatabase();
  let userInfo = useSelector((state) => state.user.value);

  let [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const friendRef = ref(db, "friends/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().whosendid == userInfo.uid ||
          item.val().whoreceiveid == userInfo.uid
        ) {
          arr.push({ ...item.val(), fid: item.key });
        }
      });
      setFriendList(arr);
    });
  }, []);

  let handleBlock = (item) => {
    console.log(item);
    if (userInfo.uid == item.whosendid) {
      set(push(ref(db, "block/")), {
        blockbyname: userInfo.displayName,
        blockbyid: userInfo.uid,
        blockid: item.whoreceiveid,
        blockname: item.whoreceivename,
      }).then(() => {
        remove(ref(db, "friends/" + item.fid));
      });
    } else {
      set(push(ref(db, "block/")), {
        blockbyname: userInfo.displayName,
        blockbyid: userInfo.uid,
        blockid: item.whosendid,
        blockname: item.whosendname,
      }).then(() => {
        remove(ref(db, "friends/" + item.fid));
      });
    }
  };

  return (
    <div className="boxcontainer">
      <div className="titleholder">
        <h2>Friend List</h2>
      </div>
      {friendList.map((item) => (
        <div className="box">
          <div className="img">
            <img src={boximg} />
          </div>
          <div className="title">
            {item.whoreceiveid == userInfo.uid ? (
              <h3>{item.whosendname}</h3>
            ) : (
              <h3>{item.whoreceivename}</h3>
            )}
          </div>
          <Button
            onClick={() => handleBlock(item)}
            variant="contained"
            color="error"
          >
            Block
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Friedns;
