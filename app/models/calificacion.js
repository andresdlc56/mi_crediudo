module.exports = function(sequelize, Sequelize) {
 
    var Calificacion = sequelize.define('calificacion', {
        value: {
            type: Sequelize.FLOAT,
            notEmpty: true
        }
    });
    // Class Method
    Calificacion.associate = function (models) {
        Calificacion.belongsTo(models.evaluacion); //una Calificacion pertenece a una Evaluacion
    };
 
    return Calificacion;
}