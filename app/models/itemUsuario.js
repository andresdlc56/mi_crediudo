module.exports = function(sequelize, Sequelize) {
 
    var itemUsuario = sequelize.define('itemUsuario', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        calificacion: {
            type: Sequelize.INTEGER
        },
        evaluacionId: {
            type: Sequelize.INTEGER
        }
    });
    // Class Method
    itemUsuario.associate = function (models) {
        itemUsuario.belongsTo(models.item);
        itemUsuario.belongsTo(models.usuario);
        //itemUsuario.belongsTo(models.evaluacion);
    };
 
    return itemUsuario;
}