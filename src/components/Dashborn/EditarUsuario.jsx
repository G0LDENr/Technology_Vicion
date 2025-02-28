import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../style/style.css";

const EditarUsuario = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        nombre: "",
        email: "",
        telefono: "",
        password: "",
    });

    useEffect(() => {
        
        axios.get(`http://localhost:3000/api/usuarios/${id}`)
            .then((response) => {
                setUsuario({
                    nombre: response.data.nombre,
                    email: response.data.email,
                    telefono: response.data.telefono,
                    password: "", 
                });
            })
            .catch(error => console.error("Error al obtener el usuario:", error));
    }, [id]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Si la contraseña está vacía, no la actualizamos
        const updatedUser = { ...usuario };
        if (!updatedUser.password) {
            delete updatedUser.password; // Eliminamos la propiedad si está vacía
        }

        // Realizamos la actualización del usuario
        axios.put(`http://localhost:3000/api/usuarios/${id}`, updatedUser)
            .then(() => {
                alert("Usuario editado exitosamente");
                navigate("/usuarios"); // Redirigimos a la lista de usuarios o la página que prefieras
            })
            .catch((error) => {
                console.error("Error al editar usuario:", error);
                alert("Hubo un error al editar el usuario");
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Editar Usuario</h1>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={usuario.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={usuario.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Nueva Contraseña (opcional)"
                    value={usuario.password}
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={usuario.telefono}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Actualizar Usuario</button>
            </form>
            <button onClick={() => navigate("/usuarios")}>Volver a la lista de usuarios</button>
        </div>
    );
};

export default EditarUsuario;
