import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/register.css"; // Ahora usa su propio CSS

const Register = () => {
    const navigate = useNavigate();

    const [registro, setRegistro] = useState({
        nombre: "",
        email: "",
        telefono: "",
        password: ""
    });

    // Asegurar que la clase se aplique SOLO en esta página
    useEffect(() => {
        document.body.classList.add("register-body");
        return () => {
            document.body.classList.remove("register-body");
        };
    }, []);

    const handleChange = (e) => {
        setRegistro({ ...registro, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/api/register", registro)
        .then(() => alert("Usuario registrado exitosamente"))
        .catch(error => console.error("Error al registrar usuario:", error));
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-divider"></div>
                <form onSubmit={handleSubmit} className="register-form"> 
                    <h1>Crear Nuevo Usuario</h1> 
                    <input type="text" name="nombre" placeholder="Nombre" value={registro.nombre} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={registro.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={registro.password} onChange={handleChange} required />
                    <input type="tel" name="telefono" placeholder="Teléfono" value={registro.telefono} onChange={handleChange} required />
                    <button type="submit">Registrarse</button>
                    <button type="button" onClick={() => navigate("/login")}>Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
