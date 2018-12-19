module.exports = function(sequelize, Sequelize) {
 
    var tipoEvento = sequelize.define('tipoEvento', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    tipoEvento.associate = function (models) {
        tipoEvento.hasMany(models.evento);
    };
 
    return tipoEvento;
}