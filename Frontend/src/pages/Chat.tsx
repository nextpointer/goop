import { useParams,useNavigate } from "react-router-dom";

import "../Chat.css";
import { useState, useEffect } from "react";
import socket from "../socket";
import { PopUp } from "../components/PopUp";
import { v4 as uuidv4 } from "uuid";

interface Chat {
  message: string;
  mine?: boolean;
  userId: string;
  username: string;
}

export const Chat = () => {
  const param = useParams();
  const navigate  =useNavigate()

  const [chatInput, setChatInput] = useState<string>("");

  const [messages, setmessages] = useState<Chat[]>([]);
  const [users, setUsers] = useState([]);
  const [showPopUP, setPopup] = useState<boolean>(true);
  const [nameInput, setNameInput] = useState<string>("");
  const [userId,setUserId] = useState<string>("")
  
  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };
  

useEffect(()=>{
    const userID = uuidv4()
    setUserId(userID)
},[])

  useEffect(() => {
    if (nameInput) {
      socket.on("newUser", (users) => {
        setUsers(users);
      });

      socket.on("message", (msg: Chat) => {
        setmessages((prev) => [
          ...prev,
          { message: msg.message, mine:(msg.userId===userId)?true:false,userId:userId,username:msg.username },
        ]);
        scrollToBottom();
      });

      socket.on('join',(roomname)=>{
        socket.emit("join",roomname)
      })

      socket.on("leave", (roomName) => {
        socket.emit("leave", roomName);
      });


      return () => {
        socket.off("newUser");
        socket.off("message");
        socket.off("join");
        socket.off("leave");
      };
    }
  }, [nameInput]);

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  const sendMessage = () => {
    if (chatInput.length > 0) {
      const newMessage: Chat = {
        message: chatInput,
        userId:userId,
        username:nameInput
      };

      // setmessages([...messages,newMessage])
      setChatInput("");
      socket.emit("message", newMessage,param.id);
    }
  };


  const onpopUpSubmit = (name: string) => {
    setNameInput(name);
    setPopup(false);
    socket.emit("join",param.id)
  };

  const LeaveRoom = ()=>{
    socket.emit("leave",param.id,nameInput)
    navigate("/")
  }
  return (
    <>
      <main>
        {showPopUP && <PopUp onSubmit={onpopUpSubmit} />}
        <h1>
          Room ID is <span id="roomID">{param.id}</span>
        </h1>
        <button onClick={LeaveRoom}>Leave Room</button>
        <div className="chat-section">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`msg ${message.mine ? "mine" : "other"}`}
            >
              <span>{message.username}:{message.message}</span>
            </div>
          ))}
        </div>
        <div className="chat-input-section">
          <textarea
            className="chat-input"
            onInput={handleTextArea}
            value={chatInput}
          />
          <button className="chat-send" onClick={sendMessage}>
            SEND
          </button>
        </div>
      </main>
    </>
  );
};
