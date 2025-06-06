import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

function CreateAuctionItem({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const [defaultStartTime, setDefaultStartTime] = useState("");
  const [defaultEndTime, setDefaultEndTime] = useState("");

  function getLocalDateTimeString(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // returns in "YYYY-MM-DDTHH:mm"
  }


  useEffect(() => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setDefaultStartTime(getLocalDateTimeString(now));
    setDefaultEndTime(getLocalDateTimeString(oneHourLater));
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "unsigned-goali");
    const cloudName = "dgvc3mvc5";

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return response.data.secure_url;
  };

  function toUTCISOString(localDateTimeStr) {
    const localDate = new Date(localDateTimeStr);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
  }


  const onSubmit = async (data) => {
    console.log('Form Data:', data);

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
      current_bid: data.starting_bid || 0,
      start_time: toUTCISOString(data.start_time),
      end_time: toUTCISOString(data.end_time),
      image_url: uploadedImageURL,
      owner_id: user.id,
    };

    console.log('Auction Item Data:', auctionItemData);

    try {
      const response = await axios.post("http://localhost:5000/auction", auctionItemData, {
        withCredentials: true,
      });
      console.log('Auction Item Created:', response.data);
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
          defaultValue={defaultStartTime}
          className="w-full border p-2 rounded"
        />
        {errors.start_time && <p className="text-red-500">{errors.start_time.message}</p>}

        <input
          {...register('end_time', { required: "End time is required" })}
          type="datetime-local"
          defaultValue={defaultEndTime}
          min={defaultStartTime}
          className="w-full border p-2 rounded"
        />
        {errors.end_time && <p className="text-red-500">{errors.end_time.message}</p>}

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
