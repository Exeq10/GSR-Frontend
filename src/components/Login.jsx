import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {


    const navigate = useNavigate();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 4000);
  };

  const manejarLogin = async () => {
    if (!username.trim() || !password.trim()) {
      mostrarMensaje("Completa todos los campos.");
      return;
    }

    try {
      setCargando(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}auth/login`, {
        username,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/detalle"); 
      } else {
        mostrarMensaje("Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mostrarMensaje("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/gsrlogo.png" alt="Logo" className="w-40 h-40 object-contain" />
      </div>

      {/* Título */}
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
        Iniciar sesión
      </h2>

      {/* Campos de texto */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Botón */}
      <button
        onClick={manejarLogin}
        disabled={cargando}
        className={`w-full ${
          cargando ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
        } text-white py-3 rounded-lg font-semibold text-sm transition duration-200`}
      >
        {cargando ? "Ingresando..." : "Iniciar sesión"}
      </button>

      {/* Mensaje de error */}
      {mensaje && (
        <p className="mt-4 text-center text-red-600 font-medium">{mensaje}</p>
      )}
    </div>
  );
};

export default Login;
