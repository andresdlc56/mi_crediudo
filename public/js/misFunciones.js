function verificarFecha(fechaInicio){
	var fechaInical = new Date(fechaInicio);
	var fechaActual = new Date();

	var dia = fechaInical.getDate();
	var mes = fechaInical.getMonth()+1;
	var ano = fechaInical.getFullYear();

	if(fechaInical.getTime() > fechaActual.getTime()) {
		return alert("Disculpe, Aun no Puede Realizar La Evaluación \n La Fecha de Inicio es: "+ dia +"/" + mes + "/" + ano );
	} else {
		return false;
	}
}

function comprobar(dia, mes){
	var fechaActual = new Date();
	var diaActual = fechaActual.getDate();
	var mesActual = fechaActual.getMonth();

	if(dia < diaActual && mes <= mesActual) {
		alert("Evaluación en Curso, No se puede Eliminar");
		return false;	
	} else {
		return confirm("¿Desea Eliminar Esta Evaluación?");
	}
}

function verificar(status) {
	if(status == true) {
		return true;
	} else {
		alert('El Usuario aun no Realiza su Evaluación');
		return false;
	}
}

//Funcion para comprobar que la fecha de culminación de una Eval se a cumplido
function calificar(dia, mes) {
	var fechaActual = new Date();
	var diaActual = fechaActual.getDate();
	var mesActual = fechaActual.getMonth();

	if(dia > diaActual && mes >= mesActual) {
		alert("Debe Esperar que Culmine la Evalución para Calificar");
		return false;	
	} else {
		return true;
	}	
}