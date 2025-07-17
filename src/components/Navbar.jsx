import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserCheck,
  House,
  CalendarCheck,
  BarChart3,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleMenu = () => setOpen(!open);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const closeSesion = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toggleMenu();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/gsrlogo.png" alt="Logo" className="h-24 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-700 flex items-center gap-2 hover:text-green-600 font-medium transition duration-200"
            >
              <House className="w-4" /> Inicio
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/detalle"
                  className="text-gray-700 flex items-center gap-2 hover:text-green-600 font-medium transition duration-200"
                >
                  <CalendarCheck className="w-4" /> Reservas
                </Link>
                <Link
                  to="/estadisticas"
                  className="text-gray-700 flex items-center gap-2 hover:text-green-600 font-medium transition duration-200"
                >
                  <BarChart3 className="w-4" /> Estadísticas
                </Link>

                   <button
                onClick={closeSesion}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium w-full text-left"
              >
                <LogOut className="w-4" /> Cerrar sesión
              </button>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-gray-700 flex items-center gap-2 hover:text-green-600 font-medium transition duration-200"
              >
                <UserCheck className="w-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <Link
            to="/"
            onClick={toggleMenu}
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium"
          >
            <House className="w-4" /> Inicio
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/detalle"
                onClick={toggleMenu}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium"
              >
                <CalendarCheck className="w-4" /> Reservas
              </Link>
              <Link
                to="/estadisticas"
                onClick={toggleMenu}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium"
              >
                <BarChart3 className="w-4" /> Estadísticas
              </Link>
              <button
                onClick={closeSesion}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium w-full text-left"
              >
                <LogOut className="w-4" /> Cerrar sesión
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium"
            >
              <UserCheck className="w-4" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
