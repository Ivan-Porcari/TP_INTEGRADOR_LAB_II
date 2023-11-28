// Para las paso const tipoEleccion = 1;
const tipoEleccion = 2;
const anioEleccion = 0;
const tipoRecuento = 1;
const categoriaId = 2;
let idDistrito = 0;
let circuitoId = '';
let mesaId = '';
var periodosSelect = document.getElementById('select-aa');
var idCargo = document.getElementById('select-cargo');
var idDistritoOption = document.getElementById('select-distrito');
var selectSeccion = document.getElementById('select-seccion');
let idCargos = '';
let datosJSON = '';
let datosJSON2 = '';
let seccionProvincialId = '';
let seccionTexto = '';


const url = "https://resultados.mininterior.gob.ar/api/menu";
const urlPeriodos = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const urlCargos = "https://resultados.mininterior.gob.ar/api/menu?año=";



//Combo periodo, devuelve el dato del periodo
fetch(urlPeriodos)
    .then(response => response.json())
    .then(data => {
        data.forEach(periodo => {
            let option = document.createElement('option');
            option.text = periodo;
            option.value = periodo;
            periodosSelect.add(option);

        });
        console.log(data)
    })
    .catch(error => console.log(error))

//llamar a una función para toma rel valor del select-aa
function seleccionarAnio() {
    if (periodosSelect.value) {
        idCargo.innerHTML = '';
        idCargo.appendChild(new Option("Seleccione un Cargo", ""));
        fetch(urlCargos + periodosSelect.value) //periodosSelect = eleccion del año por el usuario
            .then(response => response.json())
            .then(data => {
                datosJSON = data;

                datosJSON.forEach((eleccion) => {
                    if (eleccion.IdEleccion == tipoEleccion) {
                        eleccion.Cargos.forEach(cargo => {
                            let option = document.createElement('option');
                            option.text = cargo.Cargo;
                            option.value = cargo.IdCargo;
                            idCargo.appendChild(option);
                        });
                    }
                });
            })
            .catch(error => console.log(error));
    } else {
        console.log("No se ha seleccionado un período.");
    }
}

function seleccionarDistrito() {
    idDistritoOption.innerHTML = '';
    idDistritoOption.appendChild(new Option("Seleccione un Distrito", ""));
    idCargos = idCargo.value;
    let selectCargo = idCargo.options[idCargo.selectedIndex];
    cargoTexto = selectCargo.textContent;

    datosJSON.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
                if (cargo.IdCargo == idCargos) {
                    cargo.Distritos.forEach(distrito => {
                        let option = document.createElement('option');
                        option.text = distrito.Distrito;
                        option.value = distrito.IdDistrito;
                        idDistritoOption.add(option);
                    });
                }

            });
        }
    })
}

function seleccionarSeccion() {
    let selectedDistrito = document.getElementById("select-distrito")
    selectSeccion.innerHTML = '';
    if (selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        document.getElementById("select-seccion").style.display = "Inline"; //si el valor no es "ARGENTINA", hace que vuelva a ser visible si ya se había seleccionado esa opción antes
        selectSeccion.appendChild(new Option("Seleccione una Sección", ""));
        idDistrito = idDistritoOption.value;
        let selectDistrito = idDistritoOption.options[idDistritoOption.selectedIndex];
        distritoTexto = selectDistrito.textContent;

        datosJSON.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach(cargo => {
                    if (cargo.IdCargo == idCargos) {
                        cargo.Distritos.forEach(distrito => {
                            if (distrito.IdDistrito == idDistrito) {
                                distrito.SeccionesProvinciales.forEach(seccionesProvinciales => {
                                    seccionesProvinciales.Secciones.forEach(distrito => {
                                        let option = document.createElement("option");
                                        option.value = distrito.IdSeccion;
                                        option.text = distrito.Seccion;
                                        selectSeccion.appendChild(option);
                                    });
                                })
                            }
                        });
                    }
                });
            }
        })
    }
    else {
        document.getElementById("select-seccion").style.display = "none"; // si se quieren buscar los resultados presidenciales a nivel nacional, esconde el selector de sección ya que es innecesario y su unica opción es "null"

        console.log(selectedDistrito.options[selectedDistrito.selectedIndex].text) // debería solo logear "ARGENTINA" por razones de debugeo, borrar más adelante
    }
}

function filtrarInformacion() {
    const partidos = document.querySelectorAll('.partido');

    partidos.forEach(box => {
        box.remove();
    });
    // Validar que los campos no estén vacíos
    let selectedDistrito = document.getElementById("select-distrito")
    if (periodosSelect.value === "Año" ||
        idCargo.value === "Cargo" ||
        idDistritoOption.value === "Distrito" ||
        selectSeccion.value === "Seccion" &&
        selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        mostrarMensaje("rojo-vacio");
        return;
    }

    let main = document.getElementById('sec-contenido');
    main.style.display = "block";
    let main2 = document.getElementById('blank');
    main2.style.display = "block";
    let main3 = document.getElementById('subtitulo');
    if (main3) {
        main3.style.display = "block";
    } else {
        console.error("El elemento 'subtitulo' no se encontró en el DOM.");
    }
    let sin_datos = document.getElementById('sin_datos');
    sin_datos.style.display = "none";
    // Recuperar valores de los filtros
    let anioEleccion = periodosSelect.value;
    let categoriaId = idCargo.value;
    let idDistrito = idDistritoOption.value;
    let seccionProvincialId = selectSeccion.value;
    let seccionId = selectSeccion.value;
    let selectedSeccion = selectSeccion.options[selectSeccion.selectedIndex];
    if (selectedDistrito.options[selectedDistrito.selectedIndex].text == "ARGENTINA") {
        seccionTexto = "";
    }
    else {
        seccionTexto = selectedSeccion.textContent
    }
    let tipoEleccionGlobal = tipoEleccion; // Asegúrate de que esta variable está definida correctamente en tu script
    let circuitoIdGlobal = circuitoId; // Asegúrate de que esta variable está definida correctamente en tu script
    let mesaIdGlobal = mesaId;

    crearTitulo(seccionTexto);


    // Construir la URL con los parámetros
    let url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccionGlobal}&categoriaId=${categoriaId}&distritoId=${idDistrito}&seccionId=${seccionId}&circuitoId=${circuitoIdGlobal}&mesaId=${mesaIdGlobal}`;
    console.log(url);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            datosJSON2 = data;
            console.log(datosJSON2);
            cargarDatos();
            mostrarMensaje("verde-cargado");
            //agregamos al dom los nombres de los partidos politicos
            const barras = document.getElementById("grid");
            const divAgrupaciones = document.createElement("div")
            document.getElementById("estadisticas_partidos").appendChild(divAgrupaciones)

            data.valoresTotalizadosPositivos.forEach(partido => {
                console.log(partido)
                console.log(partido.nombreAgrupacion)
                let divPartido = document.createElement("div")
                divPartido.classList.add("partido")
                divPartido.innerHTML = `<h4 class="partido_nombre">${partido.nombreAgrupacion}</h4>
                                        <h4 class="partido_porcentaje">${partido.votosPorcentaje}%</h4>
                                        <h4 class="partido_votos">${partido.votos}  VOTOS</h4>
                                        <label class="barra_porcentaje barras style="width:20%;"></label>
                                        <label class="barra_fondo barras"></label>`

                divAgrupaciones.appendChild(divPartido)
                const bar = `<div class="bar" style="--bar-value:${partido.votosPorcentaje}%;" data-name="${partido.nombreAgrupacion}" title="${partido.nombreAgrupacion} ${partido.votosPorcentaje}%"></div>`;
                barras.innerHTML += bar;
            })
        })
        .catch(error => {
            mostrarMensaje("amarillo-no-cargado");
        });
}

async function mostrarMensaje(color) {
    const colorMensaje = document.getElementById('color-mensaje');
    const textoMensaje = document.getElementById('texto-mensaje');

    // Define los mensajes y clases de estilo para cada color
    const mensajes = {
        'amarillo-no-cargado': {
            clase: 'amarillo',
            texto: ' No se logro completar lo solicitado',
            icono: 'fas fa-exclamation'
        },
        'amarillo-informe': {
            clase: 'amarillo',
            texto: ' El informe ya existe',
            icono: 'fas fa-exclamation'
        },
        'rojo-vacio': {
            clase: 'rojo',
            texto: ' Seleccione todos los datos antes de filtrar.',
            icono: 'fas fa-exclamation-triangle'
        },
        'verde-cargado': {
            clase: 'verde',
            texto: ' Los datos se cargaron de forma correcta.',
            icono: 'fas fa-thumbs-up'
        },
        'verde-informe': {
            clase: 'verde',
            texto: ' Los datos del informe se agregaron correctamente.',
            icono: 'fas fa-thumbs-up'
        },
        'rojo-informe': {
            clase: 'rojo',
            texto: ' No se guardará el informe vacío.',
            icono: 'fas fa-exclamation-triangle'
        },
        'rojo-error': {
            clase: 'rojo',
            texto: ' Los datos se encuentran vacios, No se guardaron en local Storage.',
            icono: 'fas fa-exclamation-triangle'
        }
    };

    // Verifica si el color proporcionado tiene un mensaje y una clase asociados
    if (mensajes[color]) {
        colorMensaje.className = mensajes[color].clase; // Asigna la clase de estilo
        textoMensaje.innerText = mensajes[color].texto; // Asigna el texto del mensaje
        textoMensaje.className = mensajes[color].icono; // Asigna la clase del icono
        // Oculta el mensaje después de un tiempo
        setTimeout(function () {
            colorMensaje.className = 'hidden';
            textoMensaje.className = ''; // Remueve la clase del icono
        }, 4000);
    }
}

function crearTitulo(seccionTexto = "") {

    const titulo = document.getElementById('sec-titulo');
    let selectedDistrito = document.getElementById("select-distrito")
    if (selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        titulo.innerHTML = `
        <div class="" id="sec-titulo">-
            <h2>Elecciones ${periodosSelect.value} | Generales</h2>
            <p class="texto-path">${periodosSelect.value} > Generales > Provisorio > ${cargoTexto} > ${distritoTexto} > ${seccionTexto}</p>
        </div>`
    }
    else {
        titulo.innerHTML = `
        <div class="" id="sec-titulo">-
            <h2>Elecciones ${periodosSelect.value} | Generales</h2>
            <p class="texto-path">${periodosSelect.value} > Generales > Provisorio > ${cargoTexto}</p>
        </div>`
    }
}


function cargarDatos() {
    const mesasEscrutadas = document.getElementById("mesas");
    const electores = document.getElementById("electores");
    const participacionEscrutado = document.getElementById("participacion");
    const mapa = document.getElementById("mapa");
    const nombreMapa = document.getElementById("nombreMapa");

    let contentMesa = datosJSON2.estadoRecuento.mesasTotalizadas;
    let contentElectores = datosJSON2.estadoRecuento.cantidadElectores;
    let contentParticipacion = datosJSON2.estadoRecuento.participacionPorcentaje;

    mesasEscrutadas.textContent = `Mesas Escrutadas ${contentMesa}`;
    electores.textContent = `Electores ${contentElectores}`;
    participacionEscrutado.textContent = `Participacion sobre escrutado ${contentParticipacion}%`;

    nombreMapa.textContent = `${distritoTexto}`;
    mapa.innerHTML = provincias[idDistrito];

}

function agregarInforme() {
    try {
        if (Object.keys(datosJSON2).length !== 0) {

            var dataInforme = {
                año: periodosSelect.value,
                tipo: 'Generales',
                recuento: 'Provisorio',
                cargo: cargoTexto,
                distrito: distritoTexto,
                seccion: seccionTexto,
                distritoId: parseInt(idDistritoOption.value),
                informe: datosJSON2
            };
        } else {
            console.error('infoJSON está vacío. No se guardará en localStorage.');

            mostrarMensaje("rojo-informe");
        }

        var storageActual = localStorage.getItem('dataInforme');

        if (storageActual) {

            var existente = JSON.parse(storageActual);
            var existe = false;

            for (var i = 0; i < existente.length; i++) {
                if (JSON.stringify(existente[i]) === JSON.stringify(dataInforme)) {
                    existe = true;
                    break;
                }
            }

            if (!existe) {
                existente.push(dataInforme);

                // Guardar el objeto actualizado en el localStorage
                localStorage.setItem('dataInforme', JSON.stringify(existente));
                console.log('JSON agregado correctamente.');
                mostrarMensaje("verde-informe");
            } else {

                mostrarMensaje("amarillo-informe");
                console.log('El JSON ya existe, no se puede agregar.');
            }
        } else {
            localStorage.setItem('dataInforme', JSON.stringify([dataInforme]));
            console.log('Primer JSON guardado correctamente.');
            mostrarMensaje("verde-informe");
        }
    } catch (error) {
        console.error('Se produjo un error:', error);
        mensajito = 'rojo';
    }
}
