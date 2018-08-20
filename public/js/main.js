$(document).ready(function() {

	$('.navegador').on('click', 'li', function() {
		$('.navegador li.active').removeClass('active');
		$(this).addClass('active');
	});

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

	$("#login").validate({
		//REGLAS DE VALIDACION
		rules:{
			cedula:{
				required:true
			},
			password: {
				required:true
			}
		},//FIN REGLAS

		messages:{
			cedula: "Campo Obligatorio",
			password: "Campo Obligatorio"
		}
	});

});