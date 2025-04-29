import { useEffect, useState } from "react";
import axios from "axios";

function MyTickets() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get("http://localhost:5000/tickets/my", {
                    withCredentials: true,
                });
                setTickets(res.data || []);
            } catch (err) {
                console.error("Failed to load tickets", err);
            }
        };

        fetchTickets();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">🎟️ My Tickets</h2>
            <div className="grid gap-6">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded p-4 shadow bg-white">
                        <h3 className="text-xl font-semibold">{ticket.events?.title}</h3>
                        <p className="text-gray-700">{ticket.events?.description}</p>
                        <p className="mt-2">📍 {ticket.events?.location}</p>
                        <p className="mt-1">🎟️ Price: Rs. {ticket.events?.price}</p>
                        <p className="mt-1 text-sm text-gray-500">Issued on: {new Date(ticket.created_at).toLocaleString()}</p>
                        <img
                            src={ticket.qr_code_url}
                            alt="Ticket QR"
                            className="h-40 w-40 mt-4 object-cover rounded"
                        />

                        {/* ✅ Add download button */}
                        <a
                            href={ticket.qr_code_url}
                            download={`ticket-${ticket.id}.png`}
                            className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                            Download QR Code
                        </a>


                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyTickets;
