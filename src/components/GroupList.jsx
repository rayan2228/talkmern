import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";

import { getDatabase, ref, onValue } from "firebase/database";
const GroupList = () => {
  const db = getDatabase();
  const grpRef = ref(db, "groups");
  const [grpList, setGrpList] = useState([]);
  useEffect(() => {
    onValue(grpRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      setGrpList(arr);
    });
  }, []);

  return (
    <div className="boxcontainer relative">
      <div className="titleholder">
        <h2>Group List</h2>
        <Button variant="contained">Create Group</Button>
      </div>

      {grpList.map((value, index) => (
        <div className="box" key={index}>
          <div className="img">
            <img src={boximg} />
          </div>
          <div className="title">
            <h3>{value.grpName}</h3>
            <h6>{value.grpTag}</h6>
          </div>
          <Button variant="contained">Join</Button>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
