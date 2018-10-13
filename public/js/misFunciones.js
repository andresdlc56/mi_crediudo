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