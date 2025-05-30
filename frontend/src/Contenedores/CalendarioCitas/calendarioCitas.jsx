import { useEffect, useState } from "react";
import Calendar from "../../Componentes/Calendario/calendario";
import Cita from "../../Componentes/Calendario/cita";
import { fetchConToken } from "../../servicioss/api";
import "../../Componentes/Calendario/calendario.css";

const CalendarioCitas = () => {
    const [citas, setCitas] = useState([]);
    const [nuevaCita, setNuevaCita] = useState({
        fecha_hora: "",
        motivo: "",
        id_cliente: "",
        id_mascota: "",
    });

    useEffect(() => {
        cargarCitas();
    }, []);

    const cargarCitas = async () => {
        try {
            const response = await fetchConToken("https://avancesestructuras-production-1eb1.up.railway.app/api/citas");
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            setCitas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando citas:", error);
            setCitas([]);
        }
    };

    const handleDateClick = (info) => {
        const clickedDate = new Date(info.date);
        const localISOTime = clickedDate.toISOString().slice(0, 16);
        setNuevaCita({ ...nuevaCita, fecha_hora: localISOTime });
    };

    const handleInputChange = (e) => {
        setNuevaCita({ 
            ...nuevaCita, 
            [e.target.name]: e.target.value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchConToken("https://avancesestructuras-production-1eb1.up.railway.app/api/agendar-cita", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...nuevaCita,
                    id_cliente: parseInt(nuevaCita.id_cliente),
                    id_mascota: parseInt(nuevaCita.id_mascota)
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await cargarCitas();
                setNuevaCita({ 
                    fecha_hora: "", 
                    motivo: "", 
                    id_cliente: "", 
                    id_mascota: "" 
                });
                alert("Cita agendada con éxito! 🐾");
            } else {
                alert(data.error || "Error al agendar la cita");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    };

    const calendarEvents = citas.map((cita) => ({
        title: `${cita.motivo} (Mascota: ${cita.id_mascota})`,
        start: cita.fecha_hora,
        extendedProps: {
            cliente: cita.id_cliente,
            mascota: cita.id_mascota
        }
    }));

    return (
        <div className="wrapper">
            <h1>📅 Calendario de Citas Veterinarias</h1>
            
            <Calendar
                events={calendarEvents}
                onDateClick={handleDateClick}
            />
            
            <Cita
                citaData={nuevaCita}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default CalendarioCitas;