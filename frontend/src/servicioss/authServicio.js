// servicios/authServicio.js
export const autenticarUsuario = async (nombre, contrasena) => {
    const response = await fetch("https://avancesestructuras-production-1eb1.up.railway.app/api/inicio-sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, contrasena }),
    });
    const data = await response.json();
    return { response, data };
  };