module.exports = function(sequelize, Sequelize) {

    var Seccion = sequelize.define('seccion', {
       nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        } 
    });

    // Class Method
    Seccion.associate = function (models) {
       Seccion.hasMany(models.modulo); //Una Seccion tiene muchos Modulos
    };
        
    return Seccion;
}