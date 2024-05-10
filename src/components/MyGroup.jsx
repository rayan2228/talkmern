import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
const MyGroup = () => {
  let userInfo = useSelector((state) => state.user.value);
  const db = getDatabase();
  const grpRef = ref(db, "groups");
  const [grpCreateShow, setGrpCreateShow] = useState(false);
  const [grpCreateValue, setGrpCreateValue] = useState({
    grpName: "",
    grpTag: "",
  });
  const [grpList, setGrpList] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrpCreateValue((prevData) => ({ ...prevData, [name]: value }));
    // setGrpcreateValue({ ...grpCreateValue, [name]: value });
  };
  const handleCreateGrp = () => {
    set(push(grpRef), {
      grpName: grpCreateValue.grpName,
      grpTag: grpCreateValue.grpTag,
      adminId: userInfo.uid,
      adminName: userInfo.displayName,
      adminPic: userInfo.photoURL,
    });
  };
  useEffect(() => {
    onValue(grpRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (item.val().adminId === userInfo.uid) {
          arr.push(item.val());
        }
      });
      setGrpList(arr);
    });
  }, []);

  return (
    <div className="boxcontainer" style={{ marginTop: "50px" }}>
      <div className="titleholder">
        <h2>My Group</h2>
        <Button
          variant="contained"
          onClick={() => setGrpCreateShow(!grpCreateShow)}
        >
          Show Create Group
        </Button>
      </div>

      {grpCreateShow && (
        <div className="grpcreate">
          <div className="passwordeye">
            <TextField
              name="grpName"
              id="outlined-basic"
              label="group name"
              variant="outlined"
              onChange={handleChange}
              value={grpCreateValue.grpName}
            />
          </div>
          <div className="passwordeye">
            <TextField
              name="grpTag"
              id="outlined-basic"
              label="group tag"
              variant="outlined"
              onChange={handleChange}
              value={grpCreateValue.grpTag}
            />
          </div>
          <Button variant="contained" onClick={handleCreateGrp}>
            Create Group
          </Button>
        </div>
      )}
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

export default MyGroup;
