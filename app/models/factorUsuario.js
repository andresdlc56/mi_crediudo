module.exports = function(sequelize, Sequelize) {
 
    var factorUsuario = sequelize.define('factorUsuario', {
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
        },
        usuarioEvaluador: {
            type: Sequelize.INTEGER
        },
        usuarioEvaluado: {
            type: Sequelize.INTEGER
        }
    });
    // Class Method
    factorUsuario.associate = function (models) {
        factorUsuario.belongsTo(models.factor);
    };
 
    return factorUsuario;
}