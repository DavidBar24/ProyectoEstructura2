
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoMascotas from '../../Componentes/infoMascotas/infoMascotas';

const ContenedorInfoMascotas = () => {
  const [idUsuario, setIdUsuario] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const obtenerMascotas = async () => {
    if (!idUsuario) {
      setError('Por favor ingresa un ID de usuario.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const respuesta = await fetch(`https://avancesestructuras-production-1eb1.up.railway.app/api/mascotas/${idUsuario}`);
      const datos = await respuesta.json();

      if (datos.mascotas) {
        setMascotas(datos.mascotas);
      } else {
        setMascotas([]);
        setError('No se encontraron mascotas para este usuario.');
      }
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      setError('Hubo un error al consultar las mascotas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Consultar Información de Mascotas</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Ingresa tu ID de usuario"
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={obtenerMascotas} style={{ padding: '0.5rem 1rem' }}>
          Consultar
        </button>
      </div>

      {loading && <p>Cargando mascotas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && mascotas.length > 0 && <InfoMascotas mascotas={mascotas} />}
    </div>
  );
};

export default ContenedorInfoMascotas;