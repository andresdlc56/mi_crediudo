module.exports = function(sequelize, Sequelize) {
 
    var Unidad = sequelize.define('unidad', {
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
    Unidad.associate = function (models) {
        Unidad.belongsTo(models.nucleo); //una Unidad pertenece a un Nucleo
        Unidad.hasMany(models.usuario); //una Unidad tiene muchos Usuarios
        Unidad.hasMany(models.evaluacion); //una Unidad tiene muchas Evaluaciones
        Unidad.hasMany(models.calificacion);
    };
 
    return Unidad;
}