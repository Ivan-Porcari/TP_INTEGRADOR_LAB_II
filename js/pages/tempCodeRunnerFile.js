async function mostrarCuadros(color) {
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
    //setTimeout(document.getElementById(mensajeClass).style.display = "none", 5000);
    setTimeout(() => {
        document.getElementById(mensajeClass).style.display = "none"}, "3000");
}
