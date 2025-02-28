import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/style.css";

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUsuario(decodedToken.nombre);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h1>Bienvenido a nuestra aplicacion {usuario ? usuario : ''}!</h1>
            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
        </div>
    );
};

export default Login;
