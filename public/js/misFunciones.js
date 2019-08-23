function verificarFecha(fechaInicio){
	var fechaInical = new Date(fechaInicio);
	var fechaActual = new Date();

	var dia = fechaInical.getDate();
	var mes = fechaInical.getMonth()+1;
	var ano = fechaInical.getFullYear();

	if(fechaInical.getTime() > fechaActual.getTime()) {
		alert("Disculpe, Aun no Puede Realizar La Evaluación \n La Fecha de Inicio es: "+ dia +"/" + mes + "/" + ano );
		return false;
	} else {
		return true;
	}
}

function verificarFin(fechaFin) {
	var fechaFinal = new Date(fechaFin);
	var fechaActual = new Date();

	if(fechaFinal.getTime() > fechaActual.getTime()) {
		alert("Disculpe, debe Esperar a que finalice la Evaluación para ver las Calificaciones de este Usuario");
		return false;
	} else {
		return true;
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

function validaNumericos(event) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
}