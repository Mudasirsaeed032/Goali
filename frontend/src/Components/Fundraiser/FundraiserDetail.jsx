import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

function FundraiserDetail() {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    axios.get("http://localhost:5000/fundraisers/with-progress")
      .then(res => {
        const found = res.data.find(f => f.id === id);
        setFundraiser(found);
      })
      .catch(err => console.error("Error fetching fundraiser", err));
  }, [id]);

  const onSubmit = async ({ amount }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/fundraisers/${id}/pay`,
        { amount },
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (err) {
      alert("Stripe error: " + (err.response?.data?.error || err.message));
    }
  };

  if (!fundraiser) return <p className="text-center p-10">Loading fundraiser...</p>;

  const percent = Math.min((fundraiser.collected_amount / fundraiser.goal_amount) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{fundraiser.title}</h1>
      <p className="text-gray-700 mb-4">{fundraiser.description}</p>
      <img src={fundraiser.image_url} className="h-64 object-cover rounded mb-4" alt="Fundraiser" />

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Raised Rs. {fundraiser.collected_amount} of Rs. {fundraiser.goal_amount}
      </p>

      {/* Donation Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("amount", { required: "Amount required", valueAsNumber: true })}
          type="number"
          placeholder="Enter amount in Rs."
          className="border rounded w-full p-2"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Donate via Stripe
        </button>
      </form>
    </div>
  );
}

export default FundraiserDetail;
