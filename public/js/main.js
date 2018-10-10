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

	$("#plani_eval").validate({
		//REGLAS DE VALIDACION
		rules:{
			categoria:{
				required:true
			},
			nucleo:{
				required:true
			},
			nombre:{
				required:true
			},
			instrumento:{
				required:true
			},
			unidad:{
				required:true
			},
			fecha_i:{
				required:true
			},
			fecha_f:{
				required:true
			}
		},//FIN REGLAS

		messages:{
			categoria: "Campo Obligatorio",
			nucleo: "Campo Obligatorio",
			nombre: "Campo Obligatorio",
			instrumento: "Campo Obligatorio",
			unidad: "Campo Obligatorio",
			fecha_i: "Campo Obligatorio",
			fecha_f: "Campo Obligatorio",
		}
	});

});