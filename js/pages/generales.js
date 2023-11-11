// Para las paso const tipoEleccion = 1;
const tipoEleccion = 2;
const anioEleccion = 0;
const tipoRecuento = 1;
const categoriaId = 2;
const idDistrito = 0;
const circuitoId = '';
const mesaId = '';
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
            const option = document.createElement('option');
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
                            const option = document.createElement('option');
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
                        const option = document.createElement('option');
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
    selectSeccion.innerHTML = '';
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
                                    const option = document.createElement("option");
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



