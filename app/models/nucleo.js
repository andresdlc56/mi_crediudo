module.exports = function(sequelize, Sequelize) {
 
    var Nucleo = sequelize.define('nucleo', {
        codigo: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },

        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        direccion: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Nucleo.associate = function (models) {
        Nucleo.hasMany(models.unidad); //un Nucleo tiene muchas Unidades
        Nucleo.hasMany(models.usuario); //un Nucleo tiene muchos Usuarios
        Nucleo.hasMany(models.evaluacion); //un Nucleo tiene muchas Evaluaciones
        Nucleo.hasMany(models.evento); //un Nucleo tiene muchas Eventos
    };
 
    return Nucleo;
}