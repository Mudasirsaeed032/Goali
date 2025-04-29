import { Navigate } from "react-router-dom";

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // or your auth context
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireAdmin;
