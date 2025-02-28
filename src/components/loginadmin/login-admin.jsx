import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/style.css";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ email: "", password: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setUsuario({ ...usuario, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    axios.post("http://localhost:3000/api/login", usuario)
      .then((response) => {
        alert("Inicio de sesión exitoso");

        const token = response.data.token;
        localStorage.setItem("token", token);

        axios.get("http://localhost:3000/api/usuario-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((userResponse) => {
          navigate("/DashboardAdmin");
        })
        .catch((error) => {
          setError("Hubo un error al obtener la información del usuario.");
          console.error(error);
        });
      })
      .catch((error) => {
        setError("Hubo un error al iniciar sesión. Verifica tus credenciales.");
        console.error(error);
      })
      .finally(() => {
        setCargando(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login de Administrador</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="email" name="email" placeholder="Email" value={usuario.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={usuario.password} onChange={handleChange} required />
        <button type="submit" disabled={cargando}>
          {cargando ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
      <button onClick={() => navigate("/login")}>Iniciar sesión como usuario normal</button>
      <button onClick={() => navigate("/")}>Crear Cuenta</button>
    </div>
  );
};

export default LoginAdmin;
