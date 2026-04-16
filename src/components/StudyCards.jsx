function StudyCards() {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-500">📚 Active Rooms</h3>
        <p className="text-3xl mt-2">3</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-500">🧠 Study Hours</h3>
        <p className="text-3xl mt-2">12h</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-500">🔥 Weekly Goal</h3>
        <p className="text-3xl mt-2">80%</p>
      </div>

    </div>
  );
}

export default StudyCards;