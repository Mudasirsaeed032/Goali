import { useEffect, useState } from "react";
import axios from "axios";

function FundraiserProgress() {
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/fundraisers/with-progress");
        setFundraisers(res.data || []);
      } catch (err) {
        console.error("Error fetching fundraisers:", err);
      }
    };

    fetchFundraisers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📈 Fundraiser Progress</h2>
      <div className="grid gap-6">
        {fundraisers.map((f) => {
          const progress = f.goal_amount
            ? Math.min((f.collected_amount / f.goal_amount) * 100, 100)
            : 0;

          return (
            <div key={f.id} className="border rounded p-4 bg-white shadow">
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-700 mb-2">{f.description}</p>
              <img src={f.image_url} alt={f.title} className="h-48 w-full object-cover rounded mb-3" />
              <div className="mb-2 text-sm text-gray-600">
                🎯 Goal: Rs. {f.goal_amount} &nbsp;&nbsp;&nbsp;
                💰 Collected: Rs. {f.collected_amount}
              </div>
              <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                <div
                  className="bg-green-500 h-4"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{progress.toFixed(1)}% funded</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FundraiserProgress;
