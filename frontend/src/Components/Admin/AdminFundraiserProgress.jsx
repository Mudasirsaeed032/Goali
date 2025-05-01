import { useEffect, useState } from "react";
import axios from "axios";

function AdminFundraiserProgress() {
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/fundraisers/admin", {
          withCredentials: true,
        });
        setFundraisers(res.data || []);
      } catch (err) {
        console.error("Failed to load fundraisers", err);
      }
    };

    fetchFundraisers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fundraiser?")) return;
  
    try {
      const res = await axios.delete(`http://localhost:5000/fundraisers/admin/${id}`, {
        withCredentials: true,
      });
  
      if (res.status === 200) {
        setFundraisers(prev => prev.filter(f => f.id !== id));
      } else {
        console.error("Delete failed: Unexpected status", res.status);
        alert("Could not delete fundraiser.");
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Could not delete fundraiser.");
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Fundraiser Progress</h2>
      <div className="space-y-4">
        {fundraisers.map((f) => {
          const percent = f.goal_amount ? Math.min(100, (f.collected_amount / f.goal_amount) * 100).toFixed(1) : 0;

          return (
            <div key={f.id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p>{f.description}</p>
              <p className="text-sm mt-1">🎯 Goal: Rs. {f.goal_amount} | 💰 Collected: Rs. {f.collected_amount}</p>
              <div className="h-4 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-4 bg-green-600 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs mt-1">Progress: {percent}%</p>
              <button
                onClick={() => handleDelete(f.id)}
                className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded"
              >
                Delete
              </button>

            </div>

          );
        })}
      </div>
    </div>
  );
}

export default AdminFundraiserProgress;
