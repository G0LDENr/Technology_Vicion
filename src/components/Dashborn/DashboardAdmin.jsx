import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../style/tablas.css";
import * as XLSX from "xlsx";

const Login = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/api/usuarios/")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const filteredUsers = usuarios.filter(user => 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm) || 
        user.telefono.includes(searchTerm) || 
        user.rol_id.toString().includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // EXPORTAR A EXCEL
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "usuarios.xlsx");
    };

    // IMPORTAR DESDE EXCEL
    const importFromExcel = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log("Datos importados:", jsonData);

            axios.post("http://localhost:3000/api/usuarios", jsonData)
            .then(response => console.log("Usuarios guardados correctamente:", response))
            .catch(error => console.error("Error al guardar usuarios:", error));
            setUsuarios([...usuarios, ...jsonData]);
        };
        reader.readAsArrayBuffer(file);
    };
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            

            <h1>Lista de Usuarios</h1>
            
            <input
                type="text"
                placeholder="Buscar por nombre, email, ID o teléfono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {filteredUsers.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td>{user.telefono}</td>
                                <td>{user.rol_id}</td>
                                <td>
                                    <Link to={`/EditarUsuario/${user.id}`}>
                                        <button className="btn-editar">Editar</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay usuarios registrados que coincidan con la búsqueda.</p>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                {currentPage > 1 && (
                    <span className="page-link" onClick={() => paginate(currentPage - 1)}>
                        &lt;
                    </span>
                )}
            
                {currentPage > 2 && (
                    <span className="page-link" onClick={() => paginate(1)}>1</span>
                )}
                {currentPage > 3 && <span className="dots">...</span>}
                {pageNumbers.slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages)).map(pageNumber => (
                    <span 
                        key={pageNumber} 
                        className={`page-link ${currentPage === pageNumber ? "active" : ""}`} 
                        onClick={() => paginate(pageNumber)}
                    >
                        {pageNumber}
                    </span>
                ))}
            
                {currentPage < totalPages - 2 && <span className="dots">...</span>}
                {currentPage < totalPages - 1 && (
                    <span className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</span>
                )}
            
                {currentPage < totalPages && (
                    <span className="page-link" onClick={() => paginate(currentPage + 1)}>
                        &gt;
                    </span>
                )}
            </div>            
            )}

            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
            <button onClick={exportToExcel} className="export-btn_excel">Descargar en Excel</button>
            <input type="file" accept=".xlsx, .xls" onChange={importFromExcel} className="import-btn" />
        </div>
    );
};

export default Login;
