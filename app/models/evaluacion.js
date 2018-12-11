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
        //Evaluacion.belongsToMany(models.usuario, {through: 'evaluacionUsuario'});
        Evaluacion.hasMany(models.evaluacionUsuario, { onDelete:'cascade' });
        Evaluacion.hasMany(models.observacion);
        //Evaluacion.belongsToMany(models.usuario, {through: 'itemUsuario', foreignKey: 'evaluacionId'});
        Evaluacion.hasOne(models.calificacion); //Una Evaluacion tiene una Calificacion
    };
 
    return Evaluacion;
}