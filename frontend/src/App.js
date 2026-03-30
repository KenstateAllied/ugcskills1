import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfessionalsList from "./pages/ProfessionalsList";
import IndustryList from "./pages/IndustryList";
import CreateUpdateEmployee from "./pages/CreateUpdateEmployee";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const defaultRoute = role === "admin" ? "/ProfessionalsList" : "/IndustryList";

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to={defaultRoute} replace /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={token ? <Navigate to={defaultRoute} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to={defaultRoute} replace /> : <Register />}
        />

        <Route
          path="/ProfessionalsList"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProfessionalsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-professional"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUpdateEmployee mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-professional/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUpdateEmployee mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/IndustryList"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <IndustryList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
