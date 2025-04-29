import { Navigate } from "react-router-dom";

function RequireAdmin({ user, children }) {
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireAdmin;
