import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <img
        src="/gsrlogo.png"
        alt="Logo"
        className="w-40 h-40 object-contain mb-6"
      />
      <h1 className="text-4xl font-bold text-green-600 mb-2">¡Ups! Página no encontrada</h1>
      <p className="text-gray-600 mb-6">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="inline-block bg-green-600 text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-green-700 transition duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default ErrorPage;
