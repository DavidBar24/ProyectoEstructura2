const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./bdtest');

// 1. CORRECCIÓN: Importar correctamente el secreto
const { SECRETO_JWT } = require('./confing');

router.post('/registro', async (req, res) => {
  try {
    const { nombre, edad, contrasena } = req.body;

    if (!nombre || !edad || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const [usuariosExistentes] = await db.query(
      'SELECT id FROM clientes WHERE nombre = ?',
      [nombre]
    );
    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    const [resultado] = await db.query(
      'INSERT INTO clientes (nombre, edad, password) VALUES (?, ?, ?)',
      [nombre, edad, contrasenaEncriptada]
    );

    const idUsuario = resultado.insertId;

    const token = jwt.sign({ id: idUsuario, nombre }, SECRETO_JWT, { expiresIn: '1h' });

    res.status(201).json({ token, id: idUsuario }); // <- Cambiado a 201

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});

module.exports = router;


// Inicio de sesión
require('dotenv').config();

// Configuración JWT


// Ruta de login mejorada
router.post('/inicio-sesion', async (req, res) => {
  try {
    const { nombre, contrasena } = req.body;

    if (!nombre || !contrasena) {
      return res.status(400).json({ error: 'Nombre y contraseña son requeridos' });
    }

    const [resultados] = await db.query(
      'SELECT id, nombre, password FROM clientes WHERE nombre = ?',
      [nombre]
    );

    if (resultados.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = resultados[0];

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.password);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      SECRETO_JWT,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre
      }
    });

  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});



















// Registrar mascota
router.post('/registrar-mascota', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener token
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, SECRETO_JWT);
    const { especie, raza, nombre, edad } = req.body;
    db.query(
      'INSERT INTO mascotas (especie, raza, nombre, edad, id_cliente) VALUES (?, ?, ?, ?, ?)',
      [especie, raza, nombre, edad, decoded.id],
      (err, resultado) => {
        if (err) {
          console.error("Error en BD:", err);
          return res.status(500).json({ error: 'Error al registrar mascota' });
        }
        res.status(201).json({ message: 'Mascota registrada' });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

  router.get('/mis-mascotas', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' }); 
  
    try {
      const decoded = jwt.verify(token, SECRETO_JWT);
      const sql = `
        SELECT m.*,
          (SELECT v.fecha_ultima_vacunacion FROM vacunacion v WHERE v.id_mascota = m.id ORDER BY v.fecha_proxima_vacunacion DESC LIMIT 1) AS ultimo_dia_vacunacion,
          (SELECT v.fecha_proxima_vacunacion FROM vacunacion v WHERE v.id_mascota = m.id ORDER BY v.fecha_proxima_vacunacion DESC LIMIT 1) AS nuevo_dia_vacunacion,
          (SELECT d.fecha_ultima_desparasitacion FROM desparasitacion d WHERE d.id_mascota = m.id ORDER BY d.fecha_proxima_desparasitacion DESC LIMIT 1) AS ultimo_dia_desparasitacion,
          (SELECT d.fecha_proxima_desparasitacion FROM desparasitacion d WHERE d.id_mascota = m.id ORDER BY d.fecha_proxima_desparasitacion DESC LIMIT 1) AS nuevo_dia_desparasitar
        FROM mascotas m
        WHERE m.id_cliente = ?;
      `;
      db.query(sql, [decoded.id], (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error en consulta' });
        res.json(resultados);
      });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  });
  
  // Agendar cita para Vacunación o Desparasitación (se requiere id_mascota)
  router.post('/agendar-cita', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { tipo, fecha, id_mascota, ...datosExtra } = req.body;
  
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    if (!id_mascota) return res.status(400).json({ error: 'Mascota requerida' });
  
    try {
      const decoded = jwt.verify(token, SECRETO_JWT);
  
      if (tipo === "VACUNACION") {
        const { vacunasExistentes, fechaUltimaVacuna } = datosExtra;
        const conexion = await db.promise();
  
        try {
          await conexion.beginTransaction();
  
          // Corregir: Usar CURRENT_DATE() si no hay fechaUltimaVacuna
          const fechaUltima = fechaUltimaVacuna || new Date().toISOString().split('T')[0];
  
          // Actualizar vacunación
          await conexion.execute(
            `INSERT INTO vacunacion (id_mascota, fecha_ultima_vacunacion, fecha_proxima_vacunacion)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
               fecha_ultima_vacunacion = VALUES(fecha_ultima_vacunacion),
               fecha_proxima_vacunacion = VALUES(fecha_proxima_vacunacion)`,
            [id_mascota, fechaUltima, fecha]
          );
  
          // Corregir: Generar placeholders dinámicos para IN (...)
          if (vacunasExistentes?.length > 0) {
            const placeholders = vacunasExistentes.map(() => '?').join(',');
            const [tratamientos] = await conexion.execute(
              `SELECT id FROM tratamientos WHERE nombre IN (${placeholders})`,
              vacunasExistentes
            );
  
            if (tratamientos.length > 0) {
              await conexion.execute(
                `INSERT INTO tratamientos_mascotas (id_tratamiento, id_mascota, fecha_tratamiento)
                 VALUES ?`,
                [tratamientos.map(t => [t.id, id_mascota, fechaUltima])]
              );
            }
          }
  
          await conexion.commit();
          res.json({ message: 'Vacunación registrada exitosamente' });
        } catch (error) {
          await conexion.rollback();
          console.error("Error en transacción:", error);
          res.status(500).json({ error: 'Error al procesar vacunación' });
        }
      } else if (tipo === "DESPARASITACION") {
        // Código de desparasitación se mantiene igual
        const { fechaDesparasitacionAnterior } = datosExtra;
        db.query(
          `INSERT INTO desparasitacion (id_mascota, fecha_proxima_desparasitacion, fecha_ultima_desparasitacion)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE
             fecha_proxima_desparasitacion = VALUES(fecha_proxima_desparasitacion),
             fecha_ultima_desparasitacion = VALUES(fecha_ultima_desparasitacion)`,
          [id_mascota, fecha, fechaDesparasitacionAnterior || null],
          (err, resultado) => {
            if (err) {
              console.error("Error en desparasitación:", err);
              return res.status(500).json({ error: 'Error al agendar desparasitación' });
            }
            res.json({ message: 'Desparasitación agendada exitosamente' });
          }
        );
      } else {
        res.status(400).json({ error: 'Tipo de cita inválido' });
      }
    } catch (error) {
      console.error("Error de token:", error);
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  });
  

/*
router.post('/agendar-cita', autenticar, (req, res) => {
    const { idCliente, idMascota, motivo, fechaHora } = req.body;

    // Validar campos requeridos
    if (!idCliente || !idMascota || !motivo || !fechaHora) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Validar tipos de datos
    if (isNaN(idCliente)) return res.status(400).json({ error: "ID Cliente inválido" });
    if (isNaN(idMascota)) return res.status(400).json({ error: "ID Mascota inválido" });

    // Formatear fecha para MySQL
    const fechaFormateada = new Date(fechaHora)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    // Validar relación mascota-cliente
    const sqlVerificacion = `SELECT id FROM mascotas 
                           WHERE id = ? AND id_cliente = ?`;
    
    db.query(sqlVerificacion, [idMascota, idCliente], (err, resultados) => {
        if (err) return res.status(500).json({ error: "Error de verificación" });
        if (resultados.length === 0) {
            return res.status(400).json({ error: "La mascota no pertenece al cliente" });
        }

        // Insertar cita
        const sqlInsert = `INSERT INTO citas 
            (id_cliente, id_mascota, motivo, fecha_hora)
            VALUES (?, ?, ?, ?)`;

        db.query(sqlInsert, 
            [idCliente, idMascota, motivo, fechaFormateada],
            (err, resultado) => {
                if (err) {
                    console.error("Error en la base de datos:", err);
                    return res.status(500).json({ 
                        error: "Error al agendar la cita",
                        detalle: err.message 
                    });
                }
                res.status(201).json({ 
                    mensaje: "Cita registrada con éxito",
                    id: resultado.insertId
                });
            }
        );
    });
});
// 2. Ruta para obtener mascotas del usuario
// ✅ Correcto: El backend usa id_cliente (igual que la BD)
router.get('/mascotas', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, SECRETO_JWT);
    const [mascotas] = await db.query(
      'SELECT * FROM mascotas WHERE id_cliente = ?', // ← id_cliente en SQL
      [decoded.id] // decoded.id debe ser el mismo que id_cliente
    );
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mascotas" });
  }
});
*/
// Exportar las rutas
module.exports = router;


