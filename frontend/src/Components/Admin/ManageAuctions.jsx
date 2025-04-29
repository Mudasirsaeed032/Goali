import { useEffect, useState } from "react";
import axios from "axios";

function ManageAuctions() {
    const [auctions, setAuctions] = useState([]);

    const fetchAuctions = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auction/admin", {
                withCredentials: true,
            });
            setAuctions(res.data);
        } catch (err) {
            console.error("Failed to fetch auctions", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this auction item?")) return;

        try {
            await axios.delete(`http://localhost:5000/auction/admin/${id}`, {
                withCredentials: true,
            });
            setAuctions(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Could not delete auction item");
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">🔨 Manage Auctions</h2>
            <div className="space-y-4">
                {auctions.map(item => (
                    <div key={item.id} className="p-4 border rounded shadow bg-white">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="mt-1 text-sm text-gray-700">Current Bid: Rs. {item.current_bid}</p>
                        <p className="text-sm">Start: {new Date(item.start_time).toLocaleString()}</p>
                        <p className="text-sm">End: {new Date(item.end_time).toLocaleString()}</p>
                        {item.image_url && (
                            <img src={item.image_url} alt="Auction" className="h-32 mt-2 rounded" />
                        )}
                        <button
                            onClick={() => handleDelete(item.id)}
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

export default ManageAuctions;
