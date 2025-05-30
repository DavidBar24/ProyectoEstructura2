import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import DesparaYVacunaComponent from "../../Componentes/DesparaYVacuna/UnificacionDespaYVacuna";
import "../../Styles/estiloDeVa.css";

const API_BASE = "https://avancesestructuras-production-1eb1.up.railway.app/api";

const ContenedorDesparaYVacuna = () => {
  const { idUsuario } = useParams();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [vacunasAnteriores, setVacunasAnteriores] = useState("");
  const [vacunasFaltantes, setVacunasFaltantes] = useState([]);
  const [fechaUltimaVacuna, setFechaUltimaVacuna] = useState("");
  const [fechaVacuna, setFechaVacuna] = useState("");
  const [desparasitadoAnterior, setDesparasitadoAnterior] = useState("");
  const [fechaDesparasitacionAnterior, setFechaDesparasitacionAnterior] = useState("");
  const [fechaDesparasitacion, setFechaDesparasitacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const toDate = (str) => (str ? new Date(str) : null);

  useEffect(() => {
    const obtenerMascotas = async () => {
      setLoading(true);
      setError("");

      try {
        // Llamada al endpoint público /mascotas/:idUsuario
        const res = await fetch(`${API_BASE}/mascotas/${idUsuario}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        // data.mascotas contiene el array de mascotas
        const arr = data.mascotas || [];
        // Ordenamos por próxima vacunación o desparasitación
        arr.sort((a, b) => {
          const nextA = toDate(a.fecha_proxima_vacunacion) || toDate(a.fecha_proxima_desparasitacion);
          const nextB = toDate(b.fecha_proxima_vacunacion) || toDate(b.fecha_proxima_desparasitacion);
          if (!nextA) return 1;
          if (!nextB) return -1;
          return nextA - nextB;
        });

        setMascotas(arr);
      } catch (err) {
        console.error('Error al cargar mascotas:', err);
        setError("Error al cargar mascotas.");
        setMascotas([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerMascotas();
  }, [idUsuario]);

  const agendarCita = async (tipo) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠ Sesión expirada, vuelve a iniciar sesión.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    if (!selectedMascota) {
      setMensaje("⚠ Selecciona una mascota");
      return;
    }

    const fecha = tipo === "VACUNACION" ? fechaVacuna : fechaDesparasitacion;
    if (!fecha) {
      setMensaje("⚠ Selecciona una fecha");
      return;
    }

    if (tipo === "VACUNACION" && new Date(fecha) < new Date()) {
      setMensaje("⚠ La fecha de vacunación debe ser futura");
      return;
    }

    try {
      const body = { tipo, fecha, id_mascota: selectedMascota };

      if (tipo === "VACUNACION") {
        body.vacunasExistentes = vacunasAnteriores === "si" ? [] : [];
        body.vacunasFaltantes = vacunasFaltantes;
        body.fechaUltimaVacuna = vacunasAnteriores === "si" ? fechaUltimaVacuna : null;
      }

      if (tipo === "DESPARASITACION") {
        body.fechaDesparasitacionAnterior = desparasitadoAnterior === "si" ? fechaDesparasitacionAnterior : null;
      }

      const res = await fetch(`${API_BASE}/agendar-cita`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const resp = await res.json();
      if (res.ok) {
        setMensaje("✅ Cita agendada con éxito");
        await new Promise((r) => setTimeout(r, 500));
        window.location.reload();
      } else {
        setMensaje(`❌ ${resp.error || 'Error interno'}`);
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error de conexión");
    } finally {
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <DesparaYVacunaComponent
      mascotas={mascotas}
      loading={loading}
      error={error}
      selectedMascota={selectedMascota}
      setSelectedMascota={setSelectedMascota}
      vacunasAnteriores={vacunasAnteriores}
      setVacunasAnteriores={setVacunasAnteriores}
      vacunasFaltantes={vacunasFaltantes}
      setVacunasFaltantes={setVacunasFaltantes}
      fechaUltimaVacuna={fechaUltimaVacuna}
      setFechaUltimaVacuna={setFechaUltimaVacuna}
      fechaVacuna={fechaVacuna}
      setFechaVacuna={setFechaVacuna}
      desparasitadoAnterior={desparasitadoAnterior}
      setDesparasitadoAnterior={setDesparasitadoAnterior}
      fechaDesparasitacionAnterior={fechaDesparasitacionAnterior}
      setFechaDesparasitacionAnterior={setFechaDesparasitacionAnterior}
      fechaDesparasitacion={fechaDesparasitacion}
      setFechaDesparasitacion={setFechaDesparasitacion}
      agendarCita={agendarCita}
      mensaje={mensaje}
    />
  );
};

export default ContenedorDesparaYVacuna;
