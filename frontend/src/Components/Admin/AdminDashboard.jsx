import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🛠 Admin Dashboard</h2>

      <div className="grid gap-6">
        <Link to="/admin/fundraisers" className="block p-4 bg-blue-100 rounded hover:bg-blue-200">
          Manage Fundraisers
        </Link>

        <Link to="/admin/auctions" className="block p-4 bg-blue-100 rounded hover:bg-blue-200">
          Manage Auctions
        </Link>

        <Link to="/admin/events" className="block p-4 bg-blue-100 rounded hover:bg-blue-200">
          Manage Events
        </Link>

        <Link to="/admin/users" className="block p-4 bg-blue-100 rounded hover:bg-blue-200">
          Manage Users
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
