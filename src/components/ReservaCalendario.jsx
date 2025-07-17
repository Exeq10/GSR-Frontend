import React, { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import axios from "axios";
import { tiposDeEventos } from "../utils/Eventos.js";

// Utilidades
const formatearFecha = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

const calcularPrecioTotal = (evento, cantidad) => {
  if (!evento || cantidad <= 0) return 0;
  const rango = evento.preciosPorRango.find((r) => cantidad <= r.hasta);
  return rango ? rango.precio : 0;
};

const calcularSenia = (precioTotal) => Math.round(precioTotal * 0.3);

const ReservaCalendario = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [fechasReservadas, setFechasReservadas] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [apellidoCliente, setApellidoCliente] = useState("");
  const [celularCliente, setCelularCliente] = useState("");
  const [tipoEvento, setTipoEvento] = useState(tiposDeEventos[0]?.nombre || "");
  const [cantidadPersonas, setCantidadPersonas] = useState("");
  const [mensaje, setMensaje] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchFechas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}reservas/disponibles`);
        const fechas = res.data.fechasReservadas.map((fecha) => {
          const [yyyy, mm, dd] = fecha.split("-");
          return new Date(yyyy, mm - 1, dd);
        });
        setFechasReservadas(fechas);
      } catch (error) {
        console.error("Error al obtener fechas", error);
      }
    };
    fetchFechas();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const eventoSeleccionado = tiposDeEventos.find((e) => e.nombre === tipoEvento);
  const precioTotal = calcularPrecioTotal(eventoSeleccionado, Number(cantidadPersonas));
  const senia = calcularSenia(precioTotal);

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMensaje(""), 4000);
  };

  const enviarReserva = async () => {
    if (
      !fechaSeleccionada ||
      !nombreCliente.trim() ||
      !apellidoCliente.trim() ||
      !celularCliente.trim() ||
      !tipoEvento ||
      Number(cantidadPersonas) <= 0
    ) {
      mostrarMensaje("Debes completar todos los campos correctamente.");
      return;
    }

    if (precioTotal === 0) {
      mostrarMensaje("La cantidad de personas no está dentro de los rangos permitidos.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}reservas`, {
        nombreCliente,
        apellidoCliente,
        celularCliente,
        fechaReserva: formatearFecha(fechaSeleccionada),
        tipoEvento,
        senia,
        cantidadPersonas: Number(cantidadPersonas),
      });

      if (res.data?.initPoint) {
        window.location.href = res.data.initPoint;
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al crear la reserva. ¿Quizás la fecha ya fue reservada?");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/gsrlogo.png" alt="Logo" className="w-72 h-72 object-contain" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendario */}
        <div className="md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona una fecha:</label>
          <div className="rounded-md border border-gray-300 p-2">
            <DayPicker
              mode="single"
              selected={fechaSeleccionada}
              onSelect={(date) => date && setFechaSeleccionada(date)}
              disabled={[
                ...fechasReservadas,
                { before: new Date(new Date().setHours(0, 0, 0, 0)) },
              ]}
              modifiersClassNames={{
                selected: "text-white bg-green-600",
                disabled: "text-red-500 bg-red-100",
              }}
            />
          </div>
        </div>

        {/* Formulario */}
        <div className="md:w-1/2">
          {[ 
            { label: "Nombre", value: nombreCliente, onChange: setNombreCliente },
            { label: "Apellido", value: apellidoCliente, onChange: setApellidoCliente },
            { label: "Celular", value: celularCliente, onChange: setCelularCliente },
          ].map(({ label, value, onChange }) => (
            <div className="mb-4" key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de personas:</label>
            <input
              type="number"
              min="1"
              value={cantidadPersonas}
              onChange={(e) => setCantidadPersonas(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento:</label>
            <select
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {tiposDeEventos.map((evento) => (
                <option key={evento.nombre} value={evento.nombre}>
                  {evento.nombre}
                </option>
              ))}
            </select>
          </div>

          {Number(cantidadPersonas) > 0 && (
            <div className="mb-5 p-4 bg-gray-100 rounded-md text-gray-700 text-sm">
              Precio total: <span className="font-semibold text-blue-600">${precioTotal}</span><br />
              Seña (30%): <span className="font-semibold text-green-600">${senia}</span>
            </div>
          )}

          <button
            onClick={enviarReserva}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm transition duration-200"
          >
            Reservar y pagar seña
          </button>

          {mensaje && (
            <p className="mt-4 text-center text-red-600 font-medium">{mensaje}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservaCalendario;
