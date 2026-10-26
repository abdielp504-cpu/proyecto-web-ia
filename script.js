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
const contenedorFavoritos = document.getElementById("favoritos");

const API_URL = "https://rickandmortyapi.com/api/character";

// ---------- Estado de la paginación ----------
let paginaActual = 1;
let totalPaginas = 1;
// ---------- Favoritos (localStorage) ----------
function obtenerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
  } catch (error) {
    return [];
  }
}

function guardarFavoritos(lista) {
  localStorage.setItem("favoritos", JSON.stringify(lista));
}

function esFavorito(id) {
  return obtenerFavoritos().some((p) => p.id === id);
}

function alternarFavorito(personaje) {
  let favoritos = obtenerFavoritos();

  if (esFavorito(personaje.id)) {
    favoritos = favoritos.filter((p) => p.id !== personaje.id);
  } else {
    favoritos.push(personaje);
  }

  guardarFavoritos(favoritos);
  mostrarFavoritos();
  actualizarBotonesFavorito();
}

function mostrarFavoritos() {
  const favoritos = obtenerFavoritos();
  contenedorFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    contenedorFavoritos.innerHTML =
      "<p>Aún no tienes favoritos. Pulsa ☆ en un personaje para guardarlo.</p>";
    return;
  }

  favoritos.forEach((personaje) => {
    contenedorFavoritos.appendChild(crearTarjeta(personaje));
  });
}

// Actualiza el texto de todos los botones según si el personaje es favorito
function actualizarBotonesFavorito() {
  document.querySelectorAll(".tarjeta button[data-id]").forEach((boton) => {
    const id = Number(boton.dataset.id);
    boton.textContent = esFavorito(id) ? "★ Quitar de favoritos" : "☆ Agregar a favoritos";
  });
}

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
function crearTarjeta(personaje) {
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
      <button type="button" data-id="${personaje.id}">
        ${esFavorito(personaje.id) ? "★ Quitar de favoritos" : "☆ Agregar a favoritos"}
      </button>
    </div>
  `;

  tarjeta.querySelector("button").addEventListener("click", () => {
    alternarFavorito(personaje);
  });

  return tarjeta;
}

function mostrarPersonajes(lista) {
  resultados.innerHTML = "";
  lista.forEach((personaje) => {
    resultados.appendChild(crearTarjeta(personaje));
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
mostrarFavoritos();
cargarPersonajes();
