import React, { useState } from 'react'; 
import Register from "../components/login/register";

const Home = () => {
    const [formularioActivo, setFormularioActivo] = useState("login");
    return (
        <div>
            <div className="formu">
                <Register />
            </div>
        </div>
    );
};

export default Home;
