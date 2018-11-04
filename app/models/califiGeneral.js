module.exports = function(sequelize, Sequelize) {

    var califiGeneral = sequelize.define('califiGeneral', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        calificacion: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        }
    });
    // Class Method
    califiGeneral.associate = function (models) {
        califiGeneral.belongsTo(models.usuario);
        califiGeneral.belongsTo(models.evaluacion);
        //evaluacionUsuario.belongsTo(models.usuario);
        //evaluacionUsuario.belongsTo(models.usuario, {foreignKey: 'usuarioEvaluado'});
    };
 
    return califiGeneral;
}