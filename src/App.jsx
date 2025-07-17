import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ReservaCalendario from "./components/ReservaCalendario";
import ReservasDetalle from "./components/ReservaDetalle";
import TotalesMensualesReservas from "./components/TotalesMensualesReservas";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ErrorPage from "./components/ErrorPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
       
      <div className="pt-20  bg-gray-100 min-h-screen">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<ReservaCalendario />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/detalle" element={<ReservasDetalle />} />
            <Route path="/estadisticas" element={<TotalesMensualesReservas />} />
          </Route>

          <Route path="*" element={<ErrorPage/>} />
        </Routes>
   <Footer/>
      </div>
    </Router>
  );
}

export default App;
