module.exports = function(sequelize, Sequelize) {
 
    var tipoEval = sequelize.define('tipoEval', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    tipoEval.associate = function (models) {
        tipoEval.hasMany(models.instrument);
    };
 
    return tipoEval;
}