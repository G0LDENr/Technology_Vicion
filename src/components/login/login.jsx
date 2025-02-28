import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(Number(localStorage.getItem(usuario.email)) || 0);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleChange = (e) => setUsuario({ ...usuario, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isBlocked) {
      setError("Este usuario está bloqueado temporalmente debido a intentos fallidos.");
      return;
    }

    axios.post("http://localhost:3000/api/login", usuario)
      .then((response) => {
        alert("Inicio de sesión exitoso");
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem(usuario.email, 0);
        setAttempts(0);
        navigate("/welcome");
      })
      .catch((error) => {
        let newAttempts = attempts + 1;
        localStorage.setItem(usuario.email, newAttempts);
        setAttempts(newAttempts);

        if (newAttempts === 3) {
          setError("¡Atención! Te quedan solo 2 intentos antes de que tu cuenta se bloquee.");
        } else if (newAttempts === 4) {
          setError("¡Atención! Te quedan solo 1 intento antes de que tu cuenta se bloquee.");
        } else if (newAttempts === 5) {
          setIsBlocked(true);
          setError("Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos.");
        } else if (newAttempts < 3) {
          setError("Hubo un error al iniciar sesión. Verifica tus credenciales.");
        }
        console.error(error);
      });
  };

  return (
    <div className="login-container">
  <div className="login-content">
    <div className="image-container">
      <h2>Bienvenido a Technology Vicion</h2>
      <br />
      <img src="../../../public/img/logo.png" alt="Login" className="login-image" />
    </div>
    <div className="divider"></div>
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Login</h1>
      {error && <p className="error-text">{error}</p>}
      <input type="email" name="email" placeholder="Email" value={usuario.email} onChange={handleChange} required disabled={isBlocked} />
      <input type="password" name="password" placeholder="Password" value={usuario.password} onChange={handleChange} required disabled={isBlocked} />
      <button type="submit" className="login-btn" disabled={isBlocked}>Iniciar sesión</button>
      <button onClick={() => navigate("/")} className="signup-btn" disabled={isBlocked}>Crear Cuenta</button>
    </form>
  </div>
</div>

  );
};

export default Login;
