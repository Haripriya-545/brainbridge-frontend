import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

function ChatWindow({ roomId }) {
  
  const [seenMessages, setSeenMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const username = localStorage.getItem("name");
  const bottomRef = useRef(null);
  const socket = useRef(null);

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));

  /* ==========================
     LOAD INITIAL MESSAGES
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (roomId) loadMessages();
  }, [roomId]);

  /* ==========================
     SOCKET CONNECTION
  ========================== */

  useEffect(() => {

    socket.current = io("https://brainbridge-backend-1.onrender.com");

    socket.current.emit("joinRoom", {
      roomId,
      username
    });

    socket.current.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.current.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("typing", (name) => {
      setTypingUser(name);
    });

    socket.current.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => socket.current.disconnect();

  }, [roomId]);

  /* ==========================
     AUTO SCROLL
  ========================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ==========================
     SEND MESSAGE
  ========================== */

  const sendMessage = () => {
    if (!text.trim()) return;

    const msgData = {
      roomId,
      content: text,
      sender_id: userId,
      sender_name: username || "User"
    };

    socket.current.emit("sendMessage", msgData);
    setText("");
  };

  /* ==========================
     UI
  ========================== */

  return (
    <div
      style={{
        background: "transparent", // ✅ FIXED
        color: "#3a2e2a",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "10px" }}>
  <h1 style={{ marginBottom: "5px" }}>BrainBridge</h1>

  <p style={{
    fontSize: "14px",
    color: "#5c4033",
    fontWeight: "500",
    letterSpacing: "0.5px",
    marginBottom: "8px"
  }}>
    Together We Grow
  </p>
</div>

      {/* ONLINE USERS */}
      <div style={{ marginLeft: "10px", marginBottom: "5px" }}>
        🟢 Online: {onlineUsers.join(", ")}
      </div>

      {/* TYPING */}
      {typingUser && (
        <div style={{ marginLeft: "10px", fontSize: "12px", color: "#555" }}>
          ✍️ {typingUser} is typing...
        </div>
      )}

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
overflowY: "auto",
padding: "20px",
background: "rgba(255,255,255,0.5)",
borderRadius: "18px",
boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
margin: "10px",
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;

          return (
            <div
              key={msg.id}
              style={{
                textAlign: isMe ? "right" : "left",
                margin: "10px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "12px",
                  background: isMe ? "#8b3a3a" : "#f2e3de",
                  color: isMe ? "white" : "#3a2e2a",
                }}
              >
                <p style={{
  fontSize: "12px",
  fontWeight: "600",
  marginBottom: "4px",
  color: isMe ? "#f3d2c1" : "#7a5c4f"
}}>
  {msg.sender_name}
</p>
                

                {msg.content}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "rgba(255,255,255,0.3)", // ✅ FIXED
          backdropFilter: "blur(6px)",
        }}
      >
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            socket.current.emit("typing", { roomId, username });

            setTimeout(() => {
              socket.current.emit("stopTyping", { roomId });
            }, 1000);
          }}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              socket.current.emit("stopTyping", { roomId });
            }
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            background: "#8b3a3a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;