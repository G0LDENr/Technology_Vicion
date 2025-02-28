import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3000/api/usuario-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { rol_id } = response.data;

        if (rol_id === 1) {
          navigate("/DashboardAdmin");
        } else if (rol_id === 2) {
          navigate("/Welcome");
        }
      })
      .catch(() => {
        navigate("/login");
      });
    }
  }, [navigate, token]);

  return children;
};

export default ProtectedRoute;
