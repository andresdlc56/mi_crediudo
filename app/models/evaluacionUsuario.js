module.exports = function(sequelize, Sequelize) {
 
    var evaluacionUsuario = sequelize.define('evaluacionUsuario', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
         usuarioCedula: {
            type: Sequelize.INTEGER
        },
        calificacion: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        }, 
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    // Class Method
    evaluacionUsuario.associate = function (models) {
        evaluacionUsuario.belongsTo(models.evaluacion);
        evaluacionUsuario.belongsTo(models.usuario, {foreignKey: 'usuarioEvaluado'});
        //evaluacionUsuario.belongsTo(models.usuario, {foreignKey: 'usuarioEvaluado'});
    };
 
    return evaluacionUsuario;
}