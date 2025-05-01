import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // for navigation
import { Link } from "react-router-dom";

function CreateAuctionItem({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  // Image upload and form data setup logic (same as before)...
  
  const onSubmit = async (data) => {
    // Form submission logic
    try {
      const auctionItemData = {
        title: data.title,
        description: data.description,
        current_bid: data.starting_bid || 0,
        start_time: data.start_time,
        end_time: data.end_time,
        image_url: imageURL, // Make sure imageURL is set
        owner_id: user.id,
      };

      await axios.post("http://localhost:5000/auction", auctionItemData, {
        withCredentials: true,
      });

      alert("Auction Item Created!");
      navigate("/auction"); // Navigate to AuctionList after creation
    } catch (error) {
      alert("Error creating auction item");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Auction Item</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form Inputs for Title, Description, Bid, Start/End Time, Image */}
        <input {...register('title', { required: "Title is required" })} placeholder="Auction Title" className="w-full" />
        {errors.title && <p>{errors.title.message}</p>}
        
        <textarea {...register('description', { required: "Description is required" })} placeholder="Auction Description" className="w-full" />
        {errors.description && <p>{errors.description.message}</p>}
        
        <input {...register('starting_bid', { required: "Starting bid is required" })} placeholder="Starting Bid" className="w-full" />
        
        <input {...register('start_time', { required: "Start time is required" })} type="datetime-local" className="w-full" />
        
        <input {...register('end_time', { required: "End time is required" })} type="datetime-local" className="w-full" />

        {/* Image upload logic */}
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Create Auction</button>
      </form>
      
      <Link to="/auction">
        <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Back to Auction List</button>
      </Link>
    </div>
  );
}

export default CreateAuctionItem;
