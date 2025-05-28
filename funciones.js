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

    mostrarFiltrosYResultados(); // Solo tiene efecto en resultados.html
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

// ----------------------------
// FUNCIÓN GENÉRICA PARA OTRAS SECCIONES
// ----------------------------
function guardarSeccion(seccion, campos, sugerencias) {
    const datosSeccion = {};
    for (let id of campos) {
        const elemento = document.getElementById(id);
        if (!elemento || elemento.value === "") {
            alert("Por favor, completá todos los campos.");
            return;
        }
        datosSeccion[id] = elemento.value;
    }

    datos[seccion] = datosSeccion;
    localStorage.setItem("datosEasyTravesy", JSON.stringify(datos));
    localStorage.setItem("seccionActual", seccion);
    localStorage.setItem("sugerencias", JSON.stringify(sugerencias));

    window.location.href = "resultados.html";
}

// ----------------------------
// RESULTADOS
// ----------------------------
function mostrarFiltrosYResultados() {
    const seccion = localStorage.getItem("seccionActual");
    if (!seccion || !datos[seccion]) return;

    const ul = document.getElementById("datosFiltro") || document.getElementById("Datosfiltro");
    const container = document.getElementById(`resultados${capitalize(seccion)}`);
    const info = datos[seccion];

    if (ul) {
        ul.innerHTML = "";
        for (const campo in info) {
            const li = document.createElement("li");
            li.textContent = `${formatearCampo(campo)}: ${info[campo]}`;
            ul.appendChild(li);
        }
    }

    if (container) {
        const sugerencias = JSON.parse(localStorage.getItem("sugerencias")) || [];
        container.innerHTML = "";
        sugerencias.forEach(opcion => {
            const div = document.createElement("div");
            div.className = "opcion";
            div.innerHTML = `<p>${opcion}</p><button onclick="seleccionarOpcion('${seccion}', '${opcion}')">Seleccionar</button>`;
            container.appendChild(div);
        });
    }
}

function seleccionarOpcion(seccion, opcionElegida) {
    datos[seccion].seleccion = opcionElegida;
    localStorage.setItem("datosEasyTravesy", JSON.stringify(datos));
    localStorage.removeItem("seccionActual");
    localStorage.removeItem("sugerencias");
    window.location.href = "index.html";
}

// ----------------------------
// UTILIDADES
// ----------------------------
function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearCampo(campo) {
    return campo
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase());
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