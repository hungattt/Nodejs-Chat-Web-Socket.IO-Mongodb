import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatroomPage = ({ match, socket ,props}) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  console.log("id chat : "+chatroomId);

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {//chỉ gửi cho người gửi-khách hàng
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };


  const [tinnhan, setTinnhan] = React.useState([]);
  
  const getTinnhan = () => {
    axios
      .get("http://localhost:8000/message", {
        
      })
      .then((response) => {
        setTinnhan(response.data);
        console.log(response.data)
      })
      .catch((err) => {
        setTimeout(getTinnhan, 3000);
      });
  };

  React.useEffect(() => {
    getTinnhan();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {//sự kiện lắng nghe, có thể được gọi trên máy khách để thực thi trên máy chủ
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });



    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>

        
        <div className="chatroomContent">

        {/* {tinnhan.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.userId}:
              </span>{" "}
              {message.message}
            </div>
          ))} */}


          {messages.map((message, i) => (

            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {message.message}
            </div>
          ))}
        </div>

        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
         </div>
          <div>

            <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
            </div>
            <Link to={"/dashboard"}>
              <div className="ok">Back</div>
            </Link>
          
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
