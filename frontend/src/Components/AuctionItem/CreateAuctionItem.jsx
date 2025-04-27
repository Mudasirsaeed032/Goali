import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

function CreateAuctionItem({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "unsigned-goali");
    const cloudName = "dgvc3mvc5";

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      , formData)

    return response.data.secure_url;

  }

  // Form Submission Handler
  const onSubmit = async (data) => {
    console.log('Form Data:', data);  // Check form data

    // Ensure user is logged in
    if (!user || !user.id) {
      alert("You must be logged in to submit an auction item.");
      return;
    }

    let uploadedImageURL = imageURL;
    if (image && !imageURL) {
      try {
        uploadedImageURL = await handleImageUpload(image);
        setImageURL(uploadedImageURL);
      } catch (err) {
        console.error('Image upload failed', err);
        alert('Image upload failed. Please try again.');
        return;
      }
    }

    const auctionItemData = {
      title: data.title,
      description: data.description,
      current_bid: data.starting_bid || 0,  // Use current_bid instead of starting_bid
      end_time: data.end_time,
      start_time: data.start_time,  // Add start time
      image_url: uploadedImageURL,
      owner_id: user.id,  // Ensure user is logged in
    };

    console.log('Auction Item Data:', auctionItemData);  // Log data before submitting

    try {
      const response = await axios.post("http://localhost:5000/auction", auctionItemData, {
        withCredentials: true,
      });
      console.log('Auction Item Created:', response.auctionItemData);
      alert("Auction Item Created!");
    } catch (error) {
      console.error("Error creating auction item:", error.response?.data || error.message);
      alert(`Error creating auction item: ${error.response?.data?.error || error.message}`);
    }
  };




  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Auction Item</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('title', { required: "Title is required" })}
          type="text"
          placeholder="Auction Item Title"
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <textarea
          {...register('description', { required: "Description is required" })}
          placeholder="Item Description"
          className="w-full border p-2 rounded"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input
          {...register('starting_bid', { required: "Starting bid is required", valueAsNumber: true })}
          type="number"
          placeholder="Starting Bid"
          className="w-full border p-2 rounded"
        />
        {errors.starting_bid && <p className="text-red-500">{errors.starting_bid.message}</p>}

        <input
          {...register('start_time', { required: "Start time is required" })}
          type="datetime-local"
          className="w-full border p-2 rounded"
        />
        {errors.start_time && <p className="text-red-500">{errors.start_time.message}</p>}

        <input
          {...register('end_time', { required: "End time is required" })}
          type="datetime-local"
          className="w-full border p-2 rounded"
        />
        {errors.end_time && <p className="text-red-500">{errors.end_time.message}</p>}

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
          required
        />
        {imageURL && (
          <img src={imageURL} alt="Uploaded preview" className="h-40 object-cover rounded" />
        )}

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Create Auction Item
        </button>
      </form>
    </div>
  );
}

export default CreateAuctionItem;
