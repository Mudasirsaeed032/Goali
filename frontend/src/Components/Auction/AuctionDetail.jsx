import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

// Initialize socket outside component to avoid multiple connections
const socket = io('http://localhost:5000', { withCredentials: true });

function AuctionDetail() {
  const { id } = useParams(); // Get the auction item ID from URL
  const [auctionItem, setAuctionItem] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [newBid, setNewBid] = useState('');

  // Fetch auction item details on mount
  useEffect(() => {
    const fetchAuctionItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/auction/${id}`);
        setAuctionItem(response.data);
        setCurrentBid(response.data.current_bid || 0);
      } catch (error) {
        console.error("Error fetching auction item:", error);
      }
    };

    fetchAuctionItem();
  }, [id]);

  // Setup socket listeners
  useEffect(() => {
    socket.on('new_bid', (bidData) => {
      if (bidData.item_id === id) {
        setCurrentBid(bidData.amount);
      }
    });

    return () => {
      socket.off('new_bid');
    };
  }, [id]);

  // Handle placing a bid
  const handlePlaceBid = async () => {
    if (!newBid || Number(newBid) <= currentBid) {
      alert('Your bid must be higher than the current bid!');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/auction/${id}/bid`, 
        { bid_amount: Number(newBid) },
        { withCredentials: true }
      );

      // Emit event after placing bid
      socket.emit('place_bid', {
        item_id: id,
        amount: Number(newBid),
      });

      setNewBid('');
    } catch (error) {
      console.error("Error placing bid:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to place bid");
    }
  };

  if (!auctionItem) return <div>Loading auction item...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">{auctionItem.title}</h1>
      <img src={auctionItem.image_url} alt="Auction" className="w-full h-64 object-cover mb-4 rounded" />
      <p className="mb-4">{auctionItem.description}</p>

      <div className="text-lg mb-4">
        <span className="font-bold">Starting Bid:</span> ${auctionItem.starting_bid ?? 0}
      </div>
      <div className="text-xl font-bold mb-6">
        Current Highest Bid: <span className="text-green-600">${currentBid}</span>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="number"
          placeholder="Enter your bid"
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <button
          onClick={handlePlaceBid}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
}

export default AuctionDetail;
