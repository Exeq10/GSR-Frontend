import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Filter, Users, CalendarDays, User } from "lucide-react";

const ReservasDetalle = () => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroPersonas, setFiltroPersonas] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}reservas`);
        setReservas(res.data.reservas);
      } catch (err) {
        setError("Error al cargar las reservas.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    fetchReservas();
  }, []);

  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideFecha =
      !filtroFecha || reserva.fechaReserva.startsWith(filtroFecha);
    const coincidePersonas =
      !filtroPersonas || reserva.cantidadPersonas >= Number(filtroPersonas);
    const coincideNombre =
      !filtroNombre ||
      reserva.nombreCliente.toLowerCase().includes(filtroNombre.toLowerCase()) ||
      reserva.apellidoCliente.toLowerCase().includes(filtroNombre.toLowerCase());

    return coincideFecha && coincidePersonas && coincideNombre;
  });

  const reservasPorFecha = reservasFiltradas.reduce((acc, reserva) => {
    const fecha = reserva.fechaReserva;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(reserva);
    return acc;
  }, {});

  if (cargando) return <p className="text-center mt-10 animate-pulse">Cargando reservas...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white shadow-2xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2 mb-8">
        <CalendarDays className="w-7 h-7 text-green-600" />
        Reservas Agendadas
      </h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <label className="text-sm font-medium text-gray-700 flex gap-2 items-center mb-1">
            <CalendarDays className="w-4 h-4" /> Filtrar por fecha:
          </label>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="border px-3 py-2 rounded-md w-full shadow-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex gap-2 items-center mb-1">
            <Users className="w-4 h-4" /> Mínimo de personas:
          </label>
          <input
            type="number"
            min="0"
            value={filtroPersonas}
            onChange={(e) => setFiltroPersonas(e.target.value)}
            placeholder="Ej: 30"
            className="border px-3 py-2 rounded-md w-full shadow-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex gap-2 items-center mb-1">
            <User className="w-4 h-4" /> Buscar por nombre:
          </label>
          <input
            type="text"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="Ej: Juan o Gómez"
            className="border px-3 py-2 rounded-md w-full shadow-sm"
          />
        </div>
      </div>

      {/* Listado */}
      {Object.keys(reservasPorFecha).length === 0 ? (
        <p className="text-center text-gray-500">No hay reservas con esos filtros.</p>
      ) : (
        Object.keys(reservasPorFecha)
          .sort()
          .map((fecha) => (
            <div key={fecha} className="mb-8">
              <h3 className="text-xl font-semibold text-green-700 mb-3 capitalize">
                {format(new Date(fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
              </h3>

              <div className="space-y-4">
                {reservasPorFecha[fecha].map((reserva) => (
                  <div
                    key={reserva._id}
                    className="p-5 border border-gray-300 rounded-xl shadow bg-gray-50"
                  >
                    <p className="text-gray-800">
                      <span className="font-medium">Cliente:</span>{" "}
                      {reserva.nombreCliente} {reserva.apellidoCliente}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Celular:</span> {reserva.celularCliente}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Evento:</span> {reserva.tipoEvento}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Personas:</span> {reserva.cantidadPersonas}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Seña:</span>{" "}
                      <span className="text-green-600 font-bold">${reserva.senia}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default ReservasDetalle;
