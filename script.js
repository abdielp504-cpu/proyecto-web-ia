// ---------- Referencias a elementos del HTML ----------
const buscador = document.getElementById("buscador");
const filtroEstado = document.getElementById("filtro-estado");
const filtroGenero = document.getElementById("filtro-genero");
const filtroEspecie = document.getElementById("filtro-especie");
const resultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");

const API_URL = "https://rickandmortyapi.com/api/character";

// ---------- Mensajes ----------
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.classList.remove("oculto");
}

function ocultarMensaje() {
  mensaje.classList.add("oculto");
}

// ---------- Traer datos de la API ----------
async function cargarPersonajes() {
  // Construimos la URL con los valores del buscador y los filtros
  const params = new URLSearchParams();
  if (buscador.value.trim()) params.append("name", buscador.value.trim());
  if (filtroEstado.value) params.append("status", filtroEstado.value);
  if (filtroGenero.value) params.append("gender", filtroGenero.value);
  if (filtroEspecie.value) params.append("species", filtroEspecie.value);

  mostrarMensaje("Cargando personajes...");
  resultados.innerHTML = "";

  try {
    const respuesta = await fetch(`${API_URL}?${params.toString()}`);

    // La API responde 404 cuando no hay coincidencias
    if (respuesta.status === 404) {
      mostrarMensaje("No se encontraron personajes con esa búsqueda.");
      return;
    }

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta: " + respuesta.status);
    }

    const datos = await respuesta.json();
    ocultarMensaje();
    mostrarPersonajes(datos.results);
  } catch (error) {
    console.error(error);
    mostrarMensaje("Falló la consulta a la API. Revisa tu conexión e intenta de nuevo.");
  }
}

// ---------- Mostrar tarjetas ----------
function mostrarPersonajes(lista) {
  resultados.innerHTML = "";

  lista.forEach((personaje) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    tarjeta.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}">
      <div class="tarjeta-info">
        <h3>${personaje.name}</h3>
        <p>Estado: ${personaje.status}</p>
        <p>Especie: ${personaje.species}</p>
        <p>Género: ${personaje.gender}</p>
        <p>Origen: ${personaje.origin.name}</p>
      </div>
    `;

    resultados.appendChild(tarjeta);
  });
}

// ---------- Eventos ----------
// Buscador: espera 400 ms después de que el usuario deja de escribir
let temporizador;
buscador.addEventListener("input", () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(cargarPersonajes, 400);
});

// Filtros: buscan apenas cambian
filtroEstado.addEventListener("change", cargarPersonajes);
filtroGenero.addEventListener("change", cargarPersonajes);
filtroEspecie.addEventListener("change", cargarPersonajes);

// Carga inicial al abrir la página
cargarPersonajes();
