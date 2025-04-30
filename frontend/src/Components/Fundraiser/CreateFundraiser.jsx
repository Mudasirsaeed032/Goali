import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

function CreateFundraiser({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");

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
    let uploadedImageURL = imageURL;
    if (image && !imageURL) {
      uploadedImageURL = await handleImageUpload(image);
      setImageURL(uploadedImageURL);
    }

    const fundraiserData = {
      title: data.title,
      description: description, // or data.description if you've registered it via react-hook-form
      image_url: uploadedImageURL,
      goal_amount: parseFloat(data.goal_amount),
      collected_amount: 0,
      owner_id: user.id,
    };
    console.log("Fundraiser Payload:", fundraiserData);



    await axios.post("http://localhost:5000/fundraisers", fundraiserData, {
      withCredentials: true,
    });

    alert("Fundraiser created!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create a Fundraiser</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('title', { required: "Title is required" })}
          type="text"
          placeholder="Fundraiser Title"
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Simple Textarea for Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description here"
          className="w-full border p-2 rounded"
          required
        />
        <input
          {...register('goal_amount', {
            required: "Goal amount is required",
            valueAsNumber: true,
            min: { value: 1, message: "Must be at least Rs. 1" }
          })}
          type="number"
          placeholder="Target Amount (e.g. 10000)"
          className="w-full border p-2 rounded"
        />
        {errors.goal_amount && (
          <p className="text-red-500">{errors.goal_amount.message}</p>
        )}


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
          Create Fundraiser
        </button>
      </form>
    </div>
  );
}

export default CreateFundraiser;
