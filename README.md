# Tarea3_Unidad2_AplicacionesWeb
Explorador de personajes de Rick y Morty
Alumno: Abdiel Farid Pech Tec abdielp504-cpu
**https://abdielp504-cpu.github.io/proyecto-web-ia/
**https://github.com/abdielp504-cpu/proyecto-web-ia.git
## Descripción
Aplicación web que consulta la [Rick and Morty API](https://rickandmortyapi.com) con `fetch()` y muestra personajes con su imagen y datos (estado, especie, género y origen). Permite buscar por nombre, filtrar, paginar los resultados, guardar favoritos y cambiar entre modo oscuro y claro.
## Instrucciones de uso
1. Buscar: escribe un nombre en el buscador; los resultados se actualizan solos.
2. Filtrar: elige estado, género o especie. Se pueden combinar.
3. Limpiar filtros: el botón regresa todo al inicio.
4. Paginación: usa "Anterior" y "Siguiente" para ver más personajes.
5. Favoritos: pulsa ☆ en una tarjeta para guardarla; aparece en "Mis favoritos" y se conserva al recargar.
6. Tema: el botón del encabezado alterna entre modo oscuro y claro.


### Tres prompts importantes

Prompt 1 – Guía general paso a paso
Le pedí a Claude que me guiara por fases para realizar la actividad, que
me explicara cada línea de código importante y que me indicara en qué parte
del código se cumple cada requisito. Así se definió la estructura: `index.html`
(qué va y dónde), `style.css` (apariencia) y `script.js` (comportamiento),
conectados entre sí con `<link>` y `<script>`.

Prompt 2 – Conexión a la API con fetch()
Después de crear la estructura y los estilos, le pedí la conexión a la Rick and
Morty API. Claude me explicó cómo usar `fetch()` con `async/await` y agregó al
`script.js` el código para traer personajes, mostrarlos en tarjetas con imagen
y descripción, y manejar errores con `try/catch`.

Prompt 3 – Mejorar buscador y filtros
Le pedí completar la etapa del buscador y los filtros. Como resultado se
agregaron más opciones al filtro de especie (antes solo humano y alien), un
contador de resultados, paginación con botones Anterior y Siguiente, y un botón
para limpiar filtros. Los cambios se conectaron en los tres archivos.

### Una respuesta de la IA que requirió correcciones
Pedí a la IA que trabajara por fases para entender cada paso. Al terminar el
`fetch()`, la IA propuso pasar directamente a la siguiente etapa sin verificar
que las tarjetas se vieran. Le indiqué que prefería activar GitHub Pages y
comprobarlo antes de continuar, y se ajustó el orden: primero la Etapa 4 y la
verificación en Pages, y después los favoritos.

### Una modificación al código que puedo explicar
Agregué el botón "Agregar a favoritos" en cada tarjeta, modificando `script.js`
y `style.css`. Al pulsarlo, el personaje se guarda en `localStorage` (convertido
a texto con `JSON.stringify`) y aparece en la sección "Mis favoritos". Comprobé
que los personajes se agregan y se quitan correctamente, que el botón cambia
entre ☆ y ★, y que al recargar la página los favoritos siguen guardados.
Para no repetir código, la tarjeta se crea con una sola función,
`crearTarjeta()`, que sirve tanto para los resultados como para los favoritos.
### Un error encontrado y cómo lo resolví
- Error: Al probar el modo sin conexión (F12 → Network → Offline) y
  recargar la página, la aplicación de Rick and Morty dejó de mostrarse.
- Causa: Al recargar sin internet, el navegador no puede descargar los
  archivos de la página (`index.html`, `style.css` y `script.js`), que se
  sirven desde GitHub Pages. Por eso no se ejecutó ningún código de la
  aplicación. Esto es distinto de una falla de la API, que ocurre con la
  página ya cargada.
- Solución: Volví a poner la red en "No throttling" y la página volvió a
  funcionar. 
  Después comprobé el caso correcto: con la página ya cargada y la caché
desactivada, activé Offline y busqué un personaje nuevo. Apareció el mensaje
de error con el botón "Reintentar", y al restablecer la red los personajes
cargaron de nuevo. También noté que si la búsqueda ya se había hecho antes, el
navegador puede mostrarla desde su caché aunque no haya conexión.

### Reflexión
Aprendí que la IA es una buena guía cuando se trabaja por fases: al avanzar
paso a paso fui entendiendo poco a poco qué hace cada parte del proyecto, y
pude hacer modificaciones después de terminar cada etapa sin que todo se
rompiera. También me ayudó a recibir recomendaciones, y creo que es útil
consultar otras IAs para comparar opiniones, buscar ejemplos y leer el código
antes de agregarlo. Prefiero trabajar así, sin saturar a la IA con demasiada
información, porque se cometen menos errores y las explicaciones son más
claras.

## Dificultades
- Familiarizarme con más funciones de GitHub, sobre todo crear Issues y
  un Pull Request. Lo resolví leyendo cada paso con calma para no saltarme
  ninguno (crear la rama, hacer los commits en ella, abrir el PR y fusionarlo).
- Verificar cada etapa en GitHub Pages antes de
  continuar, para detectar errores a tiempo.
