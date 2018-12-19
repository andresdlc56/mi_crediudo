module.exports = function(sequelize, Sequelize) {
 
    var Evento = sequelize.define('evento', {
        nombre: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.STRING
        },
        fecha: {
            type: Sequelize.DATE
        },
        publico: {
            type: Sequelize.STRING
        },
        cupos: {
            type: Sequelize.INTEGER 
        },
        descripcion: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        files: {
            type: Sequelize.STRING
        }
    });
    // Class Method
    Evento.associate = function (models) {
        Evento.belongsTo(models.nucleo); //una Evento pertenece a un Nucleo
        Evento.belongsTo(models.tipoEvento);
    };
 
    return Evento;
}