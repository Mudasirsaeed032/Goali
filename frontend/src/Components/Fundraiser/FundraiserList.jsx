import { useEffect, useState } from 'react';
import axios from 'axios';

function FundraiserList() {
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/fundraisers/with-progress')
      .then(res => setFundraisers(res.data))
      .catch(err => console.error('Failed to fetch fundraisers', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Fundraisers</h2>
      {fundraisers.map(f => {
        const percent = Math.min((f.collected_amount / f.goal_amount) * 100, 100);

        return (
          <div key={f.id} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="text-gray-700 mb-2">{f.description}</p>
            <img src={f.image_url} alt="fundraiser" className="h-48 object-cover rounded mb-4" />
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Raised Rs. {f.collected_amount} of Rs. {f.goal_amount}
            </p>
            <a href={`/fundraisers/${f.id}/donate`}>
              <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
                Donate
              </button>
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default FundraiserList;
