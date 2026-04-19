function Sidebar({
  rooms,
  joinRoom,
  newRoom,
  setNewRoom,
  createRoom,
  selectedRoom
}) {

  return (

    <div
      style={{
        width: "260px",
        background: "rgba(255,255,255,0.3)", // 🌸 soft glass
        backdropFilter: "blur(12px)",
        boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        borderRight: "1px solid rgba(0,0,0,0.1)",
        color: "#3a2e2a",
        padding: "20px",
        height: "100vh",
        overflowY: "auto"
      }}
    >

      <h2 style={{ marginBottom: "10px" }}>BrainBridge</h2>

      <hr style={{ opacity: 0.2 }} />

      <h4 style={{ marginTop: "15px" }}>Rooms</h4>

      {rooms.map((room) => (

        <div
          key={room.id}
          onClick={() => joinRoom(room)}
          style={{
            padding: "10px",
            cursor: "pointer",
            borderRadius: "10px",
            marginBottom: "8px",
            transition: "0.2s",
            background:
              selectedRoom?.id === room.id
                ? "#a44a3f" // 🔥 active room
                : "rgba(255,255,255,0.4)",

            color:
              selectedRoom?.id === room.id
                ? "white"
                : "#3a2e2a",

            boxShadow:
              selectedRoom?.id === room.id
                ? "0 4px 10px rgba(0,0,0,0.2)"
                : "none"
          }}
        >
          # {room.name}
        </div>

      ))}

      <hr style={{ opacity: 0.2, marginTop: "20px" }} />

      {/* CREATE ROOM */}

      <input
        value={newRoom}
        onChange={(e) => setNewRoom(e.target.value)}
        placeholder="New room"
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "10px",
          border: "none",
          outline: "none",
          background: "rgba(255,255,255,0.6)",
          color: "#3a2e2a"
        }}
      />

      <button
        onClick={createRoom}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "none",
          background: "#a44a3f",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "0.2s"
        }}
      >
        + Create Room
      </button>
      <button onClick={() => deleteRoom(room._id)}>
  ❌
</button>

    </div>

  );

}

export default Sidebar;