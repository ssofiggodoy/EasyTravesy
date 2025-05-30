// ----------------------------
// VARIABLES GLOBALES
// ----------------------------
let datos = {
    destino: null,
    alojamiento: null,
    vuelos: null,
    paquetes: null,
    autos: null,
    actividades: null
};

window.onload = function () {
    const datosGuardados = localStorage.getItem("datosEasyTravesy");
    if (datosGuardados) datos = JSON.parse(datosGuardados);
};

// ----------------------------
// DESTINO
// ----------------------------
function guardarDestino() {
    const pais = document.getElementById("pais")?.value.trim();
    const ciudad = document.getElementById("ciudad")?.value.trim();
    const presupuesto = document.getElementById("presupuesto")?.value.trim();
    const caracteristica = document.getElementById("caracteristica")?.value;

    if ((pais || ciudad || caracteristica) && presupuesto) {
        datos.destino = { pais, ciudad, presupuesto, caracteristica };
        localStorage.setItem("datosEasyTravesy", JSON.stringify(datos));
        alert("Destino guardado correctamente.");
        window.location.href = "index.html";
    } else {
        alert("Completá al menos un campo de destino y el presupuesto.");
    }
}

function mostrarSugerencias() {
    const caracteristica = document.getElementById("caracteristica")?.value;
    const sugerenciasContainer = document.getElementById("sugerenciasContainer");
    sugerenciasContainer.innerHTML = "";

    if (caracteristica) {
        const opciones = {
            playa: ["Cancún", "Ibiza", "Punta Cana"],
            montaña: ["Bariloche", "Suiza", "Patagonia"],
            ciudad: ["Nueva York", "Tokio", "París"],
            aventura: ["Safari en África", "Escalada en Perú", "Selva amazónica"]
        };

        const sugeridas = opciones[caracteristica] || [];
        sugerenciasContainer.innerHTML = "<h3>Opciones sugeridas:</h3>";
        sugeridas.forEach(ciudad => {
            const boton = document.createElement("button");
            boton.textContent = ciudad;
            boton.onclick = () => document.getElementById("ciudad").value = ciudad;
            sugerenciasContainer.appendChild(boton);
        });
    }
}

function guardarSeccion(seccion, campos, sugerencias) {
    const datosSeccion = {};
    let faltantes = [];

    campos.forEach(id => {
        const elem = document.getElementById(id);
        if (!elem) {
            faltantes.push(id);
            return;
        }

        if (elem.type === "radio") {
            const seleccionado = document.querySelector(`input[name="${elem.name}"]:checked`);
            if (seleccionado) {
                datosSeccion[id] = seleccionado.value;
            } else {
                faltantes.push(id);
            }
        } else {
            const valor = elem.value.trim();
            if (valor !== "") {
                datosSeccion[id] = valor;
            } else {
                faltantes.push(id);
            }
        }
    });

    if (faltantes.length > 0) {
        alert("Por favor, completá todos los campos.");
        return;
    }

    datos[seccion] = datosSeccion;
    localStorage.setItem("datosEasyTravesy", JSON.stringify(datos));

    // ⚠️ Guardamos lo que necesita mostrarResultado()
    localStorage.setItem("datosBusqueda", JSON.stringify({
        seccion: seccion,
        filtros: datosSeccion,
        opciones: sugerencias
    }));

    window.location.href = "resultados.html";
}


function mostrarResultado() {
    const busqueda = JSON.parse(localStorage.getItem("datosBusqueda"));
    if (!busqueda || !busqueda.seccion || !busqueda.filtros) {
        document.getElementById("datosFiltro").innerHTML = "<li>No se encontraron datos de búsqueda.</li>";
        return;
    }

    const { seccion, filtros, opciones } = busqueda;

    // Mostrar filtros
    const listaFiltros = document.getElementById("datosFiltro");
    listaFiltros.innerHTML = "";
    for (const clave in filtros) {
        if (filtros[clave]) {
            const li = document.createElement("li");
            li.textContent = `${formatearClave(clave)}: ${filtros[clave]}`;
            listaFiltros.appendChild(li);
        }
    }

    // Mostrar resultados sugeridos
    const divResultados = document.getElementById("resultados" + capitalizar(seccion));
    if (divResultados) {
        divResultados.innerHTML = "";
        opciones.forEach(opcion => {
            const boton = document.createElement("button");
            boton.textContent = opcion;
            boton.className = "boton-opcion"; 
            boton.onclick = () => {
              datos[seccion] = { seleccion: opcion };
              localStorage.setItem("datosEasyTravesy", JSON.stringify(datos));
              alert(`Seleccionaste: ${opcion}`);
              window.location.href = "index.html";
          };

            divResultados.appendChild(boton);
        });
    }
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearClave(clave) {
    const map = {
        // Paquetes
        paisPaquete: "País",
        ciudadPaquete: "Ciudad",
        fechaEntradaPaquete: "Fecha de entrada",
        fechaSalidaPaquete: "Fecha de salida",
        personasPaquete: "Personas",
        habitacionesPaquete: "Habitaciones",

        // Destinos (si los usás)
        paisDestino: "País",
        ciudadDestino: "Ciudad",

        // Vuelos
        origenVuelo: "Origen",
        destinoVuelo: "Destino",
        fechaIdaVuelo: "Fecha de ida",
        fechaVueltaVuelo: "Fecha de vuelta",
        claseVuelo: "Clase",

        // Autos
        lugarRetiro: "Lugar de retiro",
        lugarDevolucion: "Lugar de devolución",
        fechaRetiroAuto: "Fecha de retiro",
        fechaDevolucionAuto: "Fecha de devolución",
        tipoAuto: "Tipo de auto",

        // Actividades
        duracionActividad: "Duración",
        tipoActividad: "Tipo",
        personasActividad: "Personas"
    };

    return map[clave] || clave;
}

document.addEventListener("DOMContentLoaded", function () {
    mostrarResultado();
});


function mostrarPerfil() {
    const datosGuardados = JSON.parse(localStorage.getItem("datosEasyTravesy"));
    const contenedor = document.getElementById("contenedorPerfil");

    if (!datosGuardados) {
        contenedor.innerHTML = "<p>No hay datos guardados.</p>";
        return;
    }

    contenedor.innerHTML = ""; // Limpiamos antes

    for (const seccion in datosGuardados) {
        const datosSeccion = datosGuardados[seccion];
        if (datosSeccion) {
            const div = document.createElement("div");
            div.classList.add("bloque-seccion");
            div.innerHTML = `<h3>${capitalizar(seccion)}</h3><ul></ul>`;

            const ul = div.querySelector("ul");

            // 🔹 Mostrar ofertas de forma especial
            if (seccion === "oferta" && datosSeccion.nombre && datosSeccion.detalles) {
                const liNombre = document.createElement("li");
                liNombre.textContent = `Nombre: ${datosSeccion.nombre}`;
                ul.appendChild(liNombre);

                datosSeccion.detalles.forEach((detalle, i) => {
                    const li = document.createElement("li");
                    li.textContent = `Detalle ${i + 1}: ${detalle}`;
                    ul.appendChild(li);
                });
            } else {
                // 🔸 Mostrar cualquier otra sección como antes
                for (const clave in datosSeccion) {
                    const li = document.createElement("li");
                    li.textContent = `${formatearClave(clave)}: ${datosSeccion[clave]}`;
                    ul.appendChild(li);
                }
            }

            contenedor.appendChild(div);
        }
    }
}



// const opcionesViaje = [
//   { titulo: "Santorini", tipo: "playa", alojamiento: "hotel" },
//   { titulo: "Machu Picchu", tipo: "montaña", alojamiento: "otros" },
//   { titulo: "París", tipo: "ciudad", alojamiento: "hotel" },
//   { titulo: "Bali", tipo: "relax", alojamiento: "hotel" },
//   { titulo: "Queenstown", tipo: "aventura", alojamiento: "otros" },
//   { titulo: "Tokio", tipo: "ciudad", alojamiento: "hotel" },
//   { titulo: "Banff", tipo: "montaña", alojamiento: "hotel" },
//   { titulo: "Cancún", tipo: "playa", alojamiento: "hotel" },
//   { titulo: "Isla de Pascua", tipo: "aventura", alojamiento: "otros" },
//   { titulo: "Roma", tipo: "ciudad", alojamiento: "hotel" },
//   { titulo: "Costa Amalfitana", tipo: "relax", alojamiento: "otros" },
//   { titulo: "Monte Everest", tipo: "montaña", alojamiento: "otros" },
//   { titulo: "Barcelona", tipo: "ciudad", alojamiento: "hotel" },
//   { titulo: "Maldivas", tipo: "playa", alojamiento: "hotel" },
//   { titulo: "Selva Amazónica", tipo: "aventura", alojamiento: "otros" },
//   { titulo: "Praga", tipo: "ciudad", alojamiento: "hotel" },
//   { titulo: "Tulum", tipo: "playa", alojamiento: "otros" },
//   { titulo: "Petra", tipo: "aventura", alojamiento: "otros" },
//   { titulo: "Kyoto", tipo: "relax", alojamiento: "hotel" },
//   { titulo: "Reikiavik", tipo: "montaña", alojamiento: "hotel" }
// ];

// function buscarAlojamiento() {
//   const seleccionado = document.querySelector('input[name="preferencia"]:checked').value;
//    const filtradas = opcionesViaje.filter(opcion => opcion.alojamiento === seleccionado);
//    const tosave = JSON.stringify(filtradas)
//   console.log(tosave);
//    localStorage.setItem("opcionesViaje",tosave);
//    localStorage.setItem("fechainicio",document.getElementById("fechaEntrada").value)
//   window.location.href="resultados.html"
// }

// function mostrarResultado() {
//   const viajes=JSON.parse(localStorage.getItem("opcionesViaje"))
//   console.log(viajes)
//   let htmltext=""
//   viajes.forEach((viaje)=>{
//     htmltext+=`<div>${viaje.titulo}</div>`})

//   document.getElementById("resultadosAlojamiento").innerHTML=htmltext;
//   document.getElementById("resultadosDestino").innerHTML=localStorage.getItem("fechaInicio")
//   document.getElementsById("resultadosVuelos").innerHTML=localStorage.getItem("fechaSalida")

// }