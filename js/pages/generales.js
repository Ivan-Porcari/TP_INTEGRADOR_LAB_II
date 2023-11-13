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
    .catch(error => consolog.log(error))

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
    // Validar que los campos no estén vacíos
    let selectedDistrito = document.getElementById("select-distrito")
    if (periodosSelect.value === "" || idCargo.value === "" || idDistritoOption.value === "" || selectSeccion.value === "" && selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        mostrarMensaje("amarillo-filtrar");
    }

    // Recuperar valores de los filtros
    let anioEleccion = periodosSelect.value;
    let categoriaId = idCargo.value;
    let idDistrito = idDistritoOption.value;
    let seccionProvincialId = selectSeccion.value;
    let seccionId = selectSeccion.value;
    let selectedSeccion = selectSeccion.options[selectSeccion.selectedIndex];
    let seccionTexto
    if (selectedDistrito.options[selectedDistrito.selectedIndex].text == "ARGENTINA"){
        seccionTexto = "";
    }
    else{
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
        })
        .catch(error => {
            mostrarMensaje("rojo-error");
        });
}

async function mostrarMensaje(color) {

    const colorMensaje = document.getElementById('color-mensaje');
    const textoMensaje = document.getElementById('texto-mensaje');

    if(color == 'amarillo-filtrar'){
        colorMensaje.setAttribute('class', 'exito');
        textoMensaje.setAttribute('class', 'fas fa-thumbs-up');
        textoMensaje.innerText = 'Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR';
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }else if( color == 'amarillo-sin-datos'){
        colorMensaje.setAttribute('class', 'exito');
        textoMensaje.setAttribute('class', 'fas fa-thumbs-up');
        textoMensaje.innerText = 'No se encontró información para la consulta realizada.';
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }else if( color == 'rojo-error'){
        colorMensaje.setAttribute('class', 'exito');
        textoMensaje.setAttribute('class', 'fas fa-thumbs-up');
        textoMensaje.innerText = 'Error';
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }else{

    }
}

function crearTitulo(seccionTexto = "") {

    const titulo = document.getElementById('sec-titulo');
    let selectedDistrito = document.getElementById("select-distrito")
    if(selectedDistrito.options[selectedDistrito.selectedIndex].text  != "ARGENTINA"){
        titulo.innerHTML = `
        <div class="" id="sec-titulo">-
            <h2>Elecciones ${periodosSelect.value} | Generales</h2>
            <p class="texto-path">${periodosSelect.value} > Generales > Provisorio > ${cargoTexto} > ${distritoTexto} > ${seccionTexto}</p>
        </div>`
    }
    else{
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

    let contentMesa = datosJSON2.estadoRecuento.mesasTotalizadas;
    let contentElectores = datosJSON2.estadoRecuento.cantidadElectores;
    let contentParticipacion = datosJSON2.estadoRecuento.participacionPorcentaje;

    mesasEscrutadas.textContent = `Mesas Escrutadas ${contentMesa}`;
    electores.textContent = `Electores ${contentElectores}`;
    participacionEscrutado.textContent = `Participacion sobre escrutado ${contentParticipacion}%`;

}

function agregarInforme() {
    // Recuperar valores
    let vAnio = periodosSelect.value;
    let vTipoRecuento = tipoRecuento; // Asegúrate de que esta variable esté definida
    let vTipoEleccion = tipoEleccion; // Asegúrate de que esta variable esté definida
    let vCategoriaId = idCargo.value;
    let vDistrito = idDistritoOption.value;
    let vSeccionProvincial = selectSeccion.value;
    let vSeccionId = selectSeccion.value; // Asumiendo que esto es correcto

    // Construir cadena
    let informeCadena = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${vSeccionId}`;

    // Continuar con los pasos 4 y 5
    validarYGuardarInforme(informeCadena);
}

function validarYGuardarInforme(informeCadena) {
    // Obtener informes existentes o inicializar un array vacío
    let informes = JSON.parse(localStorage.getItem('INFORMES')) || [];

    // Verificar si el informe ya existe
    if (informes.includes(informeCadena)) {
        mostrarCuadros()
        //mostrarMensaje("amarillo-sin-datos");
    } else {
        // Agregar el nuevo informe y guardar en localStorage
        informes.push(informeCadena);
        localStorage.setItem('INFORMES', JSON.stringify(informes));
        mostrarCuadros("verde")
        // Mostrar mensaje verde
        //mostrarMensaje("verde-exito");
    }
}

async function mostrarCuadros(color = "") {
    let mensajeClass
    switch(color){
        case "rojo":
            mensajeClass = "error";
        case "verde":
            mensajeClass = "correcto";

        default:
            mensajeClass = "cuidado";

    }
    document.getElementById(mensajeClass).style.display = "block";
    setTimeout(() => {
        document.getElementById(mensajeClass).style.display = "none"}, "3000");
}
