function Sidebar({
  rooms,
  joinRoom,
  newRoom,
  setNewRoom,
  createRoom,
  selectedRoom,
  deleteRoom   // ✅ ADD THIS
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
    key={room._id}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
    }}
  >
    {/* Room Name */}
    <div
      onClick={() => joinRoom(room)}
      style={{
        flex: 1,
        padding: "10px",
        cursor: "pointer",
        borderRadius: "10px",
        background:
          selectedRoom?._id === room._id
            ? "#a44a3f"
            : "rgba(255,255,255,0.4)",
        color:
          selectedRoom?._id === room._id
            ? "white"
            : "#3a2e2a",
      }}
    >
      # {room.name}
    </div>

    {/* DELETE BUTTON */}
    <button
      onClick={() => {
        if (window.confirm("Delete this room?")) {
          deleteRoom(room._id);
        }
      }}
      style={{
        marginLeft: "10px",
        background: "transparent",
        border: "none",
        color: "red",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      ❌
    </button>
  </div>
))}

    </div>

  );

}

export default Sidebar;