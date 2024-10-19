import { useParams, useNavigate } from "react-router-dom";
import  { Chat } from "../utils/types";
import "./Chat.css";
import { useState, useEffect, useRef } from "react";
import socket from "../utils/socket";
import { PopUp } from "../components/PopUp";
import { v4 as uuidv4 } from "uuid";


export const Chats = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState<string>("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const [_, setUsers] = useState<string[]>([]);
  const [showPopUp, setPopUp] = useState<boolean>(true);
  const [nameInput, setNameInput] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const ChatSectionRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (ChatSectionRef.current) {
      setTimeout(() => {
        ChatSectionRef.current?.scrollTo({
          top: ChatSectionRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  useEffect(() => {
    const userID = uuidv4();
    setUserId(userID);
  }, []);

  useEffect(() => {
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    socket.on('connect_timeout', (err) => {
      console.error('Connection timeout:', err);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    if (nameInput) {
      socket.on("newUser", (updatedUsers: string[]) => {
        setUsers(updatedUsers);
      });

      socket.on("message", (msg: Chat) => {
        setMessages((prev) => [
          ...prev,
          {
            message: msg.message,
            mine: msg.userId === userId,
            userId: msg.userId,
            username: msg.username,
          },
        ]);
        scrollToBottom();
      });

      return () => {
        socket.off("newUser");
        socket.off("message");
      };
    }
  }, [nameInput, userId]);

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  const sendMessage = () => {
    if (chatInput.length > 0) {
      const newMessage: Chat = {
        message: chatInput,
        userId: userId,
        username: nameInput,
      };

      setChatInput("");
      socket.emit("message", newMessage, param.id);
    }
  };

  const onPopUpSubmit = (name: string) => {
    setNameInput(name);
    setPopUp(false);
    socket.emit("join", param.id);
  };

  const leaveRoom = () => {
    socket.emit("leave", param.id, nameInput);
    navigate("/");
  };

  return (
    <>
      <main>
        {showPopUp && <PopUp onSubmit={onPopUpSubmit} />}
        <h1>
          Room ID is <span id="roomID">{param.id}</span>
        </h1>
        <button onClick={leaveRoom} id="leave-room-btn">Leave Room</button>
        <div className="chat-section" ref={ChatSectionRef}>
          {messages.map((message, index) => (
            <div key={index} className={`msg ${message.mine ? "mine" : "other"}`}>
              <span id="chat-msg">
                <span id="chat-username">{message.username}</span>: {message.message}
              </span>
            </div>
          ))}
        </div>
        <div className="chat-input-section">
          <textarea
            className="chat-input"
            onInput={handleTextArea}
            value={chatInput}
          />
          <button className="chat-send" onClick={sendMessage}>SEND</button>
        </div>
      </main>
    </>
  );
};
