import { useEffect, useState } from "react";
import axios from "axios";

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events", {
          withCredentials: true,
        });
        setEvents(res.data || []);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };

    fetchEvents();
  }, []);

  // 👇 Handle buying ticket
  const handleBuyTicket = async (eventId) => {
    try {
      const res = await axios.post(`http://localhost:5000/events/${eventId}/checkout-session`, {}, {
        withCredentials: true,
      });
      window.location.href = res.data.url; // Redirect to Stripe Checkout
    } catch (err) {
      console.error("Checkout error", err);
      alert("Could not start checkout. Are you logged in?");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.id} className="border rounded p-4 shadow bg-white">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-gray-700">{event.description}</p>
            <p className="mt-2">📍 Location: {event.location}</p>
            <p className="mt-1">🎟️ Price: Rs. {event.price}</p>

            {/* 👇 Direct Buy Button */}
            <button
              onClick={() => handleBuyTicket(event.id)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Buy Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
