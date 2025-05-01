import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming you're using UI components

function AuctionList() {
  const [auctions, setAuctions] = useState([]);

  // Fetch all auctions
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auction", {
          withCredentials: true,
        });
        setAuctions(response.data);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">All Auctions</h2>

      {/* Button to Create a New Auction */}
      <Link to="/auction/create">
        <Button className="mb-4">Create New Auction</Button>
      </Link>

      {/* List Auctions */}
      <div className="space-y-6">
        {auctions.length === 0 ? (
          <p>No auctions available.</p>
        ) : (
          auctions.map((auction) => (
            <div key={auction.id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-lg font-semibold">{auction.title}</h3>
              <p>{auction.description}</p>
              <p>Current Bid: ${auction.current_bid}</p>
              <Link to={`/auction/${auction.id}`}>
                <Button className="mt-3">View Details</Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AuctionList;
