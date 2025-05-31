// tests/globalTeardown.js
const db = require('../bdtest');

module.exports = async () => {
  console.log('🧹 Limpieza global de pruebas');
  
  try {
    await db.query('DELETE FROM clientes');
    console.log('🗑️ Datos de prueba eliminados');
  } catch (error) {
    console.error('❌ Error en limpieza global:', error);
  }
};