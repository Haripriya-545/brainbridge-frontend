import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Dashboard() {

  /* ==========================
     STATES
  ========================== */

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [newRoom, setNewRoom] = useState("");

  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId")) || 1;
  const username = localStorage.getItem("name") || "User";

  /* ==========================
     LOAD ROOMS
  ========================== */

  const loadRooms = async () => {
    try {
      const res = await fetch("https://brainbridge-backend-1.onrender.com/rooms", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();
      setRooms(data);

    } catch (err) {
      console.error("Rooms error:", err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  /* ==========================
     AUTO SELECT ROOM
  ========================== */

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoom) {
      joinRoom(rooms[0]);
    }
  }, [rooms]);

  /* ==========================
     JOIN ROOM
  ========================== */

  const joinRoom = async (room) => {

    setSelectedRoom(room);
    setMessages([]);

    try {
      await fetch(`https://brainbridge-backend-1.onrender.com/rooms/${room.id}/join`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        }
      });

      loadMessages(room.id);

    } catch (err) {
      console.error("Join error:", err);
    }
  };
 const deleteRoom = async (id) => {
  try {
    await fetch(`https://brainbridge-backend-1.onrender.com/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    // update UI
    setRooms(prev => prev.filter(room => room.id !== id));

    // if deleted room was selected
    if (selectedRoom?.id === id) {
      setSelectedRoom(null);
      setMessages([]);
    }

  } catch (err) {
    console.error("Delete failed", err);
  }
};
  /* ==========================
     LOAD MESSAGES
  ========================== */

  const loadMessages = async (roomId) => {

    try {
      const res = await fetch(
        `http://https://brainbridge-backend-1.onrender.com/rooms/${roomId}/messages`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  /* ==========================
     AUTO SCROLL
  ========================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ==========================
     SEND MESSAGE (kept)
  ========================== */

  const sendMessage = async () => {

    if (!text.trim() || !selectedRoom) return;

    try {
      const res = await fetch(
        `https://brainbridge-backend-1.onrender.com/rooms/${selectedRoom.id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({ content: text })
        }
      );

      const newMsg = await res.json();

      setMessages(prev => [...prev, newMsg]);
      setText("");

    } catch (err) {
      console.error(err);
    }
  };

  /* ==========================
     EDIT MESSAGE (kept)
  ========================== */

  const editMessage = async (msg) => {

    const newText = prompt("Edit message:", msg.content);
    if (!newText) return;

    try {
      const res = await fetch(
        `https://brainbridge-backend-1.onrender.com/messages/${msg.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({ content: newText })
        }
      );

      const updated = await res.json();

      setMessages(prev =>
        prev.map(m =>
          m.id === updated.id
            ? { ...m, content: updated.content, edited: true }
            : m
        )
      );

    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  /* ==========================
     CREATE ROOM
  ========================== */

  const createRoom = async () => {

    if (!newRoom.trim()) return;

    try {
      await fetch("https://brainbridge-backend-1.onrender.com/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          name: newRoom,
          description: "Study together"
        })
      });

      setNewRoom("");
      loadRooms();

    } catch (err) {
      console.error("Create room error:", err);
    }
  };

  /* ==========================
     LOGOUT
  ========================== */

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ==========================
     UI
  ========================== */

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <Sidebar
        rooms={rooms}
        joinRoom={joinRoom}
        newRoom={newRoom}
        setNewRoom={setNewRoom}
        createRoom={createRoom}
        selectedRoom={selectedRoom}
      />

      {/* MAIN AREA */}
      <div style={{
  flex: 1,
  background: "linear-gradient(135deg, #f6c1a3, #f9e7c3, #fff6e5)",
  color: "#3a2e2a",
  display: "flex",
  flexDirection: "column",
  height: "100vh"
}}>
        <h1>BrainBridge</h1>
        

        <button onClick={logout}>Logout</button>

        {/* 🔥 ONLY CHAT WINDOW (NO DUPLICATE UI) */}
       {selectedRoom && (
  <ChatWindow
    roomId={selectedRoom.id}
    messages={messages}
    text={text}
    setText={setText}
    sendMessage={sendMessage}
  />
)}
<Sidebar
  rooms={rooms}
  joinRoom={joinRoom}
  newRoom={newRoom}
  setNewRoom={setNewRoom}
  createRoom={createRoom}
  selectedRoom={selectedRoom}
  deleteRoom={deleteRoom}   // ✅ ADD THIS
/>

      </div>

    </div>
  );
}

export default Dashboard;