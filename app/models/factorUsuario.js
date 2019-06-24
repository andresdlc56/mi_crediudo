module.exports = function(sequelize, Sequelize) {
 
    var factorUsuario = sequelize.define('factorUsuario', {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        calificacion: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        },
        usuarioCedula: {
            type: Sequelize.INTEGER 
        }
    });
    // Class Method
    factorUsuario.associate = function (models) {
        factorUsuario.belongsTo(models.evaluacion);
        //factorUsuario.belongsTo(models.usuario);
        factorUsuario.belongsTo(models.factor);
    };
 
    return factorUsuario;
}