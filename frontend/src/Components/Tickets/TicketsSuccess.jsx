import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function TicketSuccess() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Creating your ticket...");
  const eventId = searchParams.get("eventId");

  useEffect(() => {
    const generateTicket = async () => {
      try {
        const res = await axios.post("http://localhost:5000/tickets", { event_id: eventId }, {
          withCredentials: true,
        });

        setMessage("🎉 Ticket created successfully!");
      } catch (err) {
        console.error("Ticket creation failed", err);
        setMessage("❌ Failed to create ticket.");
      }
    };

    if (eventId) {
      generateTicket();
    } else {
      setMessage("Invalid event ID.");
    }
  }, [eventId]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Ticket Purchase</h2>
      <p>{message}</p>
    </div>
  );
}

export default TicketSuccess;
