$(document).ready(function() {

	$('.navegador').on('click', 'li', function() {
		$('.navegador li.active').removeClass('active');
		$(this).addClass('active');
	});

	$('.edit-eval').on('click', function(){
		$('#edit-id').val($(this).data('id'));
		$('#edit-nucleo').val($(this).data('nucleo'));
		$('#edit-unidad').val($(this).data('unidad'));
		$('#edit-fechai').val($(this).data('fechai'));
		$('#edit-fechaf').val($(this).data('fechaf'));
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

	$("#edit_eval").validate({
		//REGLAS DE VALIDACION
		rules:{
			fecha_f:{
				required:true
			}
		},//FIN REGLAS

		messages:{
			fecha_f: "Campo Obligatorio",
		}
	});

	$("#updatePass").validate({
		//REGLAS DE VALIDACION
		rules:{
			password:{
				required:true
			},
			newPassword: {
				required:true
			},
			confirm: {
				required:true,
            	equalTo: "#newPassword"
            }
		},//FIN REGLAS

		messages:{
			password: "Campo Obligatorio",
			newPassword: "Campo Obligatorio",
			confirm: "Password de Confirmación no Coincide"
		}
	});

	$("#addNoticia").validate({
		//REGLAS DE VALIDACION
		rules:{
			titulo:{
				required:true
			},
			resumen: {
				required:true
			},
			descripcion: {
				required:true
            },
            urlImg: {
            	required: true
            }
		},//FIN REGLAS

		messages:{
			titulo: "Campo Obligatorio",
			resumen: "Campo Obligatorio",
			descripcion: "Campo Obligatoro",
			urlImg: "Campo Obligatorio"
		}
	});

	$("#formCreacion").validate({
		//REGLAS DE VALIDACION
		rules:{
			descripcion:{
				required:true
			}
		},//FIN REGLAS

		messages:{
			descripcion: "Campo Obligatorio",
		}
	});

	$("#formMision").validate({
		//REGLAS DE VALIDACION
		rules:{
			descripcion:{
				required:true
			}
		},//FIN REGLAS

		messages:{
			descripcion: "Campo Obligatorio",
		}
	});

	$("#formVision").validate({
		//REGLAS DE VALIDACION
		rules:{
			descripcion:{
				required:true
			}
		},//FIN REGLAS

		messages:{
			descripcion: "Campo Obligatorio",
		}
	});
});