// ---------- Referencias a elementos del HTML ----------
const buscador = document.getElementById("buscador");
const filtroEstado = document.getElementById("filtro-estado");
const filtroGenero = document.getElementById("filtro-genero");
const filtroEspecie = document.getElementById("filtro-especie");
const btnLimpiar = document.getElementById("btn-limpiar");
const resultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const paginacion = document.getElementById("paginacion");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const infoPagina = document.getElementById("info-pagina");

const API_URL = "https://rickandmortyapi.com/api/character";

// ---------- Estado de la paginación ----------
let paginaActual = 1;
let totalPaginas = 1;

// ---------- Mensajes ----------
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.classList.remove("oculto");
}

function ocultarMensaje() {
  mensaje.classList.add("oculto");
}

// ---------- Paginación ----------
function actualizarPaginacion() {
  if (totalPaginas <= 1) {
    paginacion.classList.add("oculto");
    return;
  }
  paginacion.classList.remove("oculto");
  infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual === totalPaginas;
}

// ---------- Traer datos de la API ----------
async function cargarPersonajes() {
  const params = new URLSearchParams();
  if (buscador.value.trim()) params.append("name", buscador.value.trim());
  if (filtroEstado.value) params.append("status", filtroEstado.value);
  if (filtroGenero.value) params.append("gender", filtroGenero.value);
  if (filtroEspecie.value) params.append("species", filtroEspecie.value);
  params.append("page", paginaActual);

  mostrarMensaje("Cargando personajes...");
  resultados.innerHTML = "";
  contador.textContent = "";

  try {
    const respuesta = await fetch(`${API_URL}?${params.toString()}`);

    // La API responde 404 cuando no hay coincidencias
    if (respuesta.status === 404) {
      totalPaginas = 1;
      actualizarPaginacion();
      mostrarMensaje("No se encontraron personajes con esa búsqueda.");
      return;
    }

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta: " + respuesta.status);
    }

    const datos = await respuesta.json();
    totalPaginas = datos.info.pages;
    ocultarMensaje();
    contador.textContent = `Se encontraron ${datos.info.count} personajes`;
    mostrarPersonajes(datos.results);
    actualizarPaginacion();
  } catch (error) {
    console.error(error);
    totalPaginas = 1;
    actualizarPaginacion();
    mostrarMensaje("Falló la consulta a la API. Revisa tu conexión e intenta de nuevo.");
  }
}

// Cuando cambia la búsqueda o un filtro, volvemos a la página 1
function buscarDesdeInicio() {
  paginaActual = 1;
  cargarPersonajes();
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
  temporizador = setTimeout(buscarDesdeInicio, 400);
});

// Filtros
filtroEstado.addEventListener("change", buscarDesdeInicio);
filtroGenero.addEventListener("change", buscarDesdeInicio);
filtroEspecie.addEventListener("change", buscarDesdeInicio);

// Botón limpiar
btnLimpiar.addEventListener("click", () => {
  buscador.value = "";
  filtroEstado.value = "";
  filtroGenero.value = "";
  filtroEspecie.value = "";
  buscarDesdeInicio();
});

// Botones de paginación
btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    cargarPersonajes();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

btnSiguiente.addEventListener("click", () => {
  if (paginaActual < totalPaginas) {
    paginaActual++;
    cargarPersonajes();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Carga inicial al abrir la página
cargarPersonajes();
