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
    };
 
    return Evaluacion;
}