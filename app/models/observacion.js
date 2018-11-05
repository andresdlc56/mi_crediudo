module.exports = function(sequelize, Sequelize) {

    var Observacion = sequelize.define('observacion', {
 
        contenido: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        calificacion: {
            type: Sequelize.DECIMAL
        }
    });
    // Class Method
    Observacion.associate = function (models) {
        Observacion.belongsTo(models.usuario);
        Observacion.belongsTo(models.evaluacion);
    };
        
    return Observacion;
}