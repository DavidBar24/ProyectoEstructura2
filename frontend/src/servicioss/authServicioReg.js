// servicios/authServicio.js
export const registrarUsuario = async (nombre, edad, contrasena) => {
  const response = await fetch("https://avancesestructuras-production-1eb1.up.railway.app/api/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, edad, contrasena }),
  });
  const data = await response.json();
  return { response, data };
};