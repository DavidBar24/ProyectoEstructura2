const mysql = require('mysql2');
require('dotenv').config();

test('Verificar conexión a la base de datos', done => {
  console.log('🔍 Probando conexión con:');
  console.log(`- Host: ${process.env.DB_HOST_TEST}`);
  console.log(`- Puerto: ${process.env.DB_PORT_TEST}`);
  console.log(`- Usuario: ${process.env.DB_USER_TEST}`);
  console.log(`- Base de datos: ${process.env.DB_NAME_TEST}`);

  const connection = mysql.createConnection({
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST,
    user: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
  });

  connection.connect(err => {
    if (err) {
      console.error('❌ Error conectando a la base de datos:', err);
      connection.end(); // Cerrar conexión incluso en error
      done(err);
    } else {
      console.log('✅ Conectado a la base de datos');
      
      // Verificar tablas
      connection.query('SHOW TABLES', (err, results) => {
        if (err) {
          console.error('❌ Error obteniendo tablas:', err);
        } else {
          console.log('📊 Tablas disponibles:', results.map(r => Object.values(r)[0]));
        }
        
        // Cerrar conexión y finalizar prueba
        connection.end(() => {
          if (err) done(err);
          else done();
        });
      });
    }
  });
}, 20000); // Timeout de 20 segundos