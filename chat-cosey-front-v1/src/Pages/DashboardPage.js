import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import makeToast from "../Toaster";
import { withRouter } from "react-router-dom";

const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  
  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  const backChatroom = () => {
    
    props.history.push("/login");
       
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  const nameRef = React.createRef();
  const registerChatroom = () => {
    const name = nameRef.current.value;
   

    axios
      .post("http://localhost:8000/chatroom", {
        
        name
      
      })
      .then((response) => {
        makeToast("success", response.data.message);
        localStorage.setItem("CC_Token", response.data.token);
        props.history.push("/dashboard");
        props.setupSocket();
        
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="back">
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox Nepal"
            ref={nameRef}
          />
        </div>
      </div>
      {/* <button>Create Chatroom</button> */}
      <button onClick={registerChatroom}>Create Chatroom</button>
      <button className="backChatroom" onClick={backChatroom}>Back</button>

      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default withRouter(DashboardPage);
