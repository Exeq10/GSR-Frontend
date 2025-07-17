import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart3, CalendarDays } from "lucide-react"; // íconos modernos

const TotalesMensualesReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}reservas`);
        setReservas(res.data.reservas);
      } catch (err) {
        setError("Error al cargar reservas.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    fetchReservas();
  }, []);

  const montosPorMes = reservas.reduce((acc, reserva) => {
    const fecha = new Date(reserva.fechaReserva);
    const claveMes = format(fecha, "yyyy-MM", { locale: es });

    if (!acc[claveMes]) {
      acc[claveMes] = { total: 0, count: 0 };
    }

    acc[claveMes].total += reserva.senia || 0;
    acc[claveMes].count += 1;

    return acc;
  }, {});

  if (cargando) return <p className="text-center mt-10 animate-pulse">Cargando totales...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-2xl border border-gray-300">
      <h2 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2 mb-8">
        <BarChart3 className="w-7 h-7 text-green-600" />
        Totales Mensuales de Reservas
      </h2>

      <ul className="grid md:grid-cols-2 gap-6">
        {Object.keys(montosPorMes)
          .sort()
          .map((mes) => {
            const [anio, mesStr] = mes.split("-");
            const fecha = new Date(Number(anio), Number(mesStr) - 1, 1);
            return (
              <li key={mes} className="p-5 bg-white border rounded-xl shadow hover:shadow-md transition">
                <p className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-2 capitalize">
                  <CalendarDays className="w-5 h-5 text-green-500" />
                  {format(fecha, "MMMM yyyy", { locale: es })}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Total de señas:</span>{" "}
                  <span className="text-green-600 font-bold">
                    ${montosPorMes[mes].total.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Cantidad de reservas:</span> {montosPorMes[mes].count}
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default TotalesMensualesReservas;
