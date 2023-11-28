var jsonStorage;

document.addEventListener('DOMContentLoaded', function () {
    var actualStorage = localStorage.getItem('dataInforme');

    if (!actualStorage) {

        mostrarMensaje("amarillo-no-informes");

    }
    else {

        jsonStorage = JSON.parse(actualStorage);
        console.log(jsonStorage);
        cargarDatosInformes();

    }
});

function cargarDatosInformes(){

    let cuadroInformes = document.getElementById('cuadro-informes');
    count = 0;

    jsonStorage.forEach(element => {
        cuadroInformes.innerHTML += `
        <tr>
            <td>
                ${element.distrito}
                <br>
                ${provincias[element.distritoId]}
            </td>
            <td id="titulo">Elecciones ${element.año}| ${element.tipo} 
                <br>
                <br>
                <p class="2020"> ${element.año} >${element.tipo} >Provisorio >${element.cargo} >${element.distrito} >${element.seccion} </p>
            </td>
            <td class="datos-generales">
                <div class="datos-div">
                    <div class="column mesas">
                        ${logos.mesas}
                        <p>Mesas Escrutadas ${element.informe.estadoRecuento.mesasTotalizadas}</p> 
                    </div>
                    <div class="column electores">
                        ${logos.electores}
                        <p>Electores ${element.informe.estadoRecuento.cantidadElectores}</p>
                    </div>
                    <div class="column participacion">
                        ${logos.participacion}
                        <p>Participacion sobre escrutado ${element.informe.estadoRecuento.participacionPorcentaje}%</p>
                    </div>
                    <br>
                </div>
            </td>
            <td id="datos-agrupacion-${count}">
                
            </td>
        </tr>
        `
        element.informe.valoresTotalizadosPositivos.forEach(agrupacion => {
            var datosAgrupacion = document.getElementById(`datos-agrupacion-${count}`);
            datosAgrupacion.innerHTML += `
            <p>${agrupacion.nombreAgrupacion}</p>
            <p>
                ${agrupacion.votosPorcentaje}%
                <br> 
                ${agrupacion.votos} Votos
            </p>
            <hr>    
            `
        })
        count += 1;
    });
}

async function mostrarMensaje(color) {
    const colorMensaje = document.getElementById('color-mensaje');
    const textoMensaje = document.getElementById('texto-mensaje');

    // Define los mensajes y clases de estilo para cada color
    const mensajes = {
        'amarillo-no-informes': {
            clase: 'amarillo',
            texto: ' No existen informes guardados para visualizar',
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