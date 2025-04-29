import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function TicketSuccess() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Creating your ticket...");
    const eventId = searchParams.get("eventId");
    const hasCreatedTicket = useRef(false); // ✅ guard against duplicate API call


    useEffect(() => {
        const generateTicket = async () => {
            if (hasCreatedTicket.current || !eventId) return;

            hasCreatedTicket.current = true; // ✅ set flag before sending request

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

        generateTicket();
    }, [eventId]);

    return (
        <div className="max-w-xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ticket Purchase</h2>
            <p>{message}</p>
        </div>
    );
}

export default TicketSuccess;
