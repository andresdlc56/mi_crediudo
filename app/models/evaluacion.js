module.exports = function(sequelize, Sequelize) {
 
    var Evaluacion = sequelize.define('evaluacion', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        fecha_i: {
            type: Sequelize.DATE
        },
        fecha_f: {
          type: Sequelize.DATE  
        }
    });
    // Class Method
    Evaluacion.associate = function (models) {
        Evaluacion.belongsTo(models.categoria); //una Evaluación pertenece a una Categoria
        Evaluacion.belongsTo(models.nucleo); //una Evaluación pertenece a un Nucleo
        Evaluacion.belongsTo(models.unidad); //una Evaluacion pertenece a una Unidad
        Evaluacion.belongsTo(models.instrument); //una Evaluacion pertenece a un Instrumento
        Evaluacion.hasMany(models.evaluacionUsuario, { onDelete:'cascade' });
        Evaluacion.hasMany(models.observacion, {onDelete:'cascade'});
        Evaluacion.hasOne(models.calificacion, { onDelete:'cascade' }); //Una Evaluacion tiene una Calificacion
        Evaluacion.hasMany(models.factorUsuario, {onDelete:'cascade'});
    };
 
    return Evaluacion;
}