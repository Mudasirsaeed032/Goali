import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { differenceInSeconds, formatDuration, intervalToDuration } from "date-fns";

const socket = io('http://localhost:5000', {
    transports: ['polling'],
    withCredentials: true,
});

function AuctionDetail() {
    const { id } = useParams();
    const [auctionItem, setAuctionItem] = useState(null);
    const [currentBid, setCurrentBid] = useState(0);
    const [newBid, setNewBid] = useState('');
    const [timeLeft, setTimeLeft] = useState('');
    const [highestBid, setHighestBid] = useState(null);

    // Fetch auction item
    useEffect(() => {
        const fetchAuctionItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/auction/${id}`, { withCredentials: true });
                setAuctionItem(response.data.auctionItem);
                setCurrentBid(response.data.auctionItem.current_bid || 0);
                setHighestBid(response.data.highestBid);
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

    // Countdown timer effect
    useEffect(() => {

        if (!auctionItem?.end_time) return;

        const endTime = new Date(auctionItem.end_time); // Supabase timestamps are in UTC!

        const interval = setInterval(() => {
            const now = new Date(); // Local time
            const secondsLeft = (endTime.getTime() - now.getTime()) / 1000;

            if (secondsLeft <= 0) {
                setTimeLeft('Auction Ended');
                clearInterval(interval);
            } else {
                const duration = intervalToDuration({ start: now, end: endTime });
                setTimeLeft(
                    formatDuration(duration, { format: ['hours', 'minutes', 'seconds'] })
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [auctionItem]);


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
            <div className="text-xl font-bold mb-2">
                Current Highest Bid: <span className="text-green-600">${currentBid}</span>
            </div>

            {/* Countdown Timer */}
            <div className="text-md font-semibold text-blue-700 mb-6">
                Time Left: {timeLeft}
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
                    disabled={timeLeft === 'Auction Ended'}
                >
                    Place Bid
                </button>
            </div>
            {timeLeft === 'Auction Ended' && highestBid && (
                <div className="mt-6 p-4 border rounded bg-green-100">
                    <h2 className="text-xl font-bold text-green-700 mb-2">Auction Winner 🏆</h2>
                    <p>Winning Bid: <strong>${highestBid.amount}</strong></p>
                    <p>Winner User ID: <strong>{highestBid.user_id}</strong></p>
                </div>
            )}

        </div>
    );
}

export default AuctionDetail;
