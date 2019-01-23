module.exports = function(sequelize, Sequelize) {
 
    var factorUsuario = sequelize.define('factorUsuario', {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }
    });
    // Class Method
    factorUsuario.associate = function (models) {
        factorUsuario.belongsTo(models.evaluacion);
    };
 
    return factorUsuario;
}