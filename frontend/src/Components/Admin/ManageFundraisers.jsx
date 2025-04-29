import { useEffect, useState } from "react";
import axios from "axios";

function ManageFundraisers() {
  const [fundraisers, setFundraisers] = useState([]);

  const fetchFundraisers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/fundraisers/admin", {
        withCredentials: true,
      });
      setFundraisers(res.data);
    } catch (err) {
      console.error("Failed to fetch fundraisers", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fundraiser?")) return;

    try {
      await axios.delete(`http://localhost:5000/fundraisers/admin/${id}`, {
        withCredentials: true,
      });
      setFundraisers((prev) => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete fundraiser");
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📢 Manage Fundraisers</h2>
      <div className="space-y-4">
        {fundraisers.map(f => (
          <div key={f.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.description}</p>
            <p className="text-sm mt-1">Raised: Rs. {f.collected_amount} / {f.goal_amount}</p>
            {f.image_url && (
              <img src={f.image_url} className="h-32 w-auto mt-2 rounded" alt="Fundraiser" />
            )}
            <button
              onClick={() => handleDelete(f.id)}
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

export default ManageFundraisers;
