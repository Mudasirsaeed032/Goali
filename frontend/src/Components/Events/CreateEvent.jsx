import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function CreateEvent({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!user || !user.id) {
      alert("You must be logged in to create an event.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/events", data, {
        withCredentials: true,
      });
      alert("Event created!");
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error.message);
      alert("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('title', { required: "Title is required" })}
          type="text"
          placeholder="Event Title"
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <textarea
          {...register('description', { required: "Description is required" })}
          placeholder="Event Description"
          className="w-full border p-2 rounded"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input
          {...register('price', { required: "Price is required", valueAsNumber: true })}
          type="number"
          placeholder="Ticket Price"
          className="w-full border p-2 rounded"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <input
          {...register('location', { required: "Location is required" })}
          type="text"
          placeholder="Location or Link"
          className="w-full border p-2 rounded"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
