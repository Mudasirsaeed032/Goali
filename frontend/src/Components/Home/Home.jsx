import { useOutletContext } from 'react-router-dom';

function Home() {
  const { user } = useOutletContext();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Welcome to GOALI 🎯</h1>
      <p className="text-center text-gray-600 mb-8">
        Explore fundraisers, support causes, and participate in auctions – no account needed.
      </p>

      {user ? (
        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Logged in as:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Full Name:</span> {user.full_name}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user.role}
          </p>

          {user.role === 'admin' && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
              <h2 className="text-xl font-semibold mb-2">Admin Access</h2>
              <p>You have access to admin-only tools like user promotion and dashboard insights.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-700">
          <p className="mb-2">
            Want to start your own fundraiser or join an auction?
          </p>
          <p>
            <a href="/login" className="text-blue-600 underline">Login</a> or <a href="/signup" className="text-blue-600 underline">create an account</a> to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
