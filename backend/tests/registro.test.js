const request = require('supertest');
const app = require('../app');
const db = require('../bdtest');

describe('Pruebas de Registro y Autenticación', () => {
  const testUser = {
    nombre: "Usuario de Prueba",
    edad: 25,
    contrasena: "Password123!"
  };

  // Limpiar base de datos antes de cada prueba
  beforeEach(async () => {
    await db.query('DELETE FROM clientes WHERE nombre = ?', [testUser.nombre]);
  });

  
  afterAll(async () => {
    await db.end();
  });

  test('Registro exitoso de usuario', async () => {
    const response = await request(app)
      .post('/api/registro')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');

    
    const [clientes] = await db.query(
      'SELECT * FROM clientes WHERE nombre = ?', 
      [testUser.nombre]
    );

    expect(clientes.length).toBe(1);
    expect(clientes[0].nombre).toBe(testUser.nombre);
  });

  test('Registro con nombre duplicado', async () => {
    // Registrar usuario primero
    await request(app).post('/api/registro').send(testUser);

    // Intentar registrar de nuevo
    const response = await request(app)
      .post('/api/registro')
      .send(testUser);

    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty('error');
  });

  test('Login exitoso', async () => {
    // Registrar usuario primero
    await request(app).post('/api/registro').send(testUser);

    // Hacer login
    const response = await request(app)
      .post('/api/inicio-sesion')
      .send({
        nombre: testUser.nombre,
        contrasena: testUser.contrasena
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('Login con credenciales incorrectas', async () => {
    const response = await request(app)
      .post('/api/inicio-sesion')
      .send({
        nombre: "usuario_inexistente",
        contrasena: "clave_incorrecta"
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});