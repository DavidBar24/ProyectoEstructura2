// tests/setupAfterEnv.js
const db = require('../bdtest');

beforeEach(async () => {
  try {
    await db.query('DELETE FROM clientes');
    console.log('🧹 Datos limpiados antes de prueba');
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
  }
});