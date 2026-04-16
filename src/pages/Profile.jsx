function Profile() {
  return (
    <div className="min-h-screen p-10">
      <div className="bg-white p-10 rounded-3xl shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-6">
          🎓 Student Profile
        </h2>

        <div className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Name" />
          <input className="w-full border p-2 rounded" placeholder="College" />
          <input className="w-full border p-2 rounded" placeholder="Bio" />
        </div>

        <button className="mt-6 bg-indigo-400 text-white px-6 py-2 rounded-lg">
          Save
        </button>
      </div>
    </div>
  );
}

export default Profile;