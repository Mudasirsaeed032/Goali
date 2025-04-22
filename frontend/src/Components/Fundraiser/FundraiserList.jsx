import { useEffect, useState } from "react";
import axios from "axios";

function FundraiserList() {
  const [fundraisers, setFundraisers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch fundraisers from backend (with optional search)
  useEffect(() => {
    const fetchFundraisers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/fundraisers", {
          params: { search },
        });
        setFundraisers(response.data);
      } catch (error) {
        console.error("Error fetching fundraisers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundraisers();
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Fundraisers</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Fundraisers"
        className="w-full border p-2 rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loading Spinner */}
      {loading && <p>Loading...</p>}

      {/* Fundraiser List */}
      {!loading && fundraisers.length === 0 && (
        <p>No fundraisers found. Please try again later.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundraisers.map((fundraiser) => (
          <div
            key={fundraiser.id}
            className="p-4 bg-gray-100 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={fundraiser.image_url}
              alt={fundraiser.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-2">{fundraiser.title}</h3>
            <p className="text-sm text-gray-700 mt-2">
              {fundraiser.description.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundraiserList;
