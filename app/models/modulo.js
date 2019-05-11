module.exports = function(sequelize, Sequelize) {

    var Modulo = sequelize.define('modulo', {
       nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        descripcion: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        urlImg: {
            type: Sequelize.STRING
        } 
    });

    // Class Method
    Modulo.associate = function (models) {
       Modulo.belongsTo(models.seccion); //un Modulo Pertenece a una Sección
    };
        
    return Modulo;
}