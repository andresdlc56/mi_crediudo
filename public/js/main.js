$(document).ready(function() {
	alert('hola');

	$("#formEvaluacion").validate({
		//REGLAS DE VALIDACION
		rules:{
			item:{
				required:true
			}
		},//FIN REGLAS

		messages:{
			item: "Campo Obligatorio",
		}
	});

});