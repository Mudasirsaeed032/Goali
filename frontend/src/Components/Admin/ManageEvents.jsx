import { useEffect, useState } from "react";
import axios from "axios";

function ManageEvents() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events/admin", {
        withCredentials: true,
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/events/admin/${id}`, {
        withCredentials: true,
      });
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🎟️ Manage Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm">📍 Location: {event.location}</p>
            <p className="text-sm">💰 Price: Rs. {event.price}</p>
            <button
              onClick={() => handleDelete(event.id)}
              className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageEvents;
