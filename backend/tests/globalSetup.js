// tests/globalSetup.js
const db = require('../bdtest');

module.exports = async () => {
  console.log('✅ Configuración global de pruebas - Inicio');
  
  try {
    // Verificar conexión
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log(`🔌 Conexión a DB verificada: ${rows[0].result === 2 ? 'OK' : 'Error'}`);
    
    // Crear tabla clientes
    await db.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        edad INT NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log('📊 Tabla "clientes" creada/verificada');
  } catch (error) {
    console.error('❌ Error en configuración global:', error);
    throw error;
  }
  
  console.log('✅ Configuración global completada');
};