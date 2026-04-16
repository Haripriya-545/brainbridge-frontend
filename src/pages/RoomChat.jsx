import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./RoomChat.css";

function RoomChat() {
  const { roomId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));

  /* ==========================
     LOAD MESSAGES
  ========================== */

  const loadMessages = async () => {
    try {
      const res = await fetch(
        `https://brainbridge-backend-1.onrender.com/rooms/${roomId}/messages`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]); // safety fix
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ==========================
     SEND MESSAGE
  ========================== */

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await fetch(
        `https://brainbridge-backend-1.onrender.com/rooms/${roomId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ content: text }),
        }
      );

      setText("");
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  /* ==========================
     UI
  ========================== */

  <div style={{
  width: "100%",
  maxWidth: "800px",
  height: "90vh",
  display: "flex",
  flexDirection: "column",
  background: "#1e293b",
  borderRadius: "16px",
  padding: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
}}>

  {/* HEADER */}
  <h2 style={{ color: "white", marginBottom: "10px" }}>
    Room {roomId}
  </h2>

  {/* CHAT */}
  <div className="chat-container" style={{
    flex: 1,
    background: "#0f172a",
    borderRadius: "10px"
  }}>
    {messages.map((msg) => {
      const isMe = msg.sender_id === userId;

      return (
        <div key={msg.id} className={`message ${isMe ? "me" : "other"}`}>
          <div className="bubble">

            {!isMe && (
              <strong style={{ fontSize: "12px", color: "#94a3b8" }}>
                {msg.sender_name || "User"}
              </strong>
            )}

            <p>{msg.content}</p>

            <span className="time">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>

          </div>
        </div>
      );
    })}

    <div ref={bottomRef}></div>
  </div>

  {/* INPUT */}
  <div className="input-box">
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Type a message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>

</div>
  
}

export default RoomChat;