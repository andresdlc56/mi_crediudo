module.exports = function(sequelize, Sequelize) {
 
    var Instrument = sequelize.define('instrument', {
        titulo: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Instrument.associate = function (models) {
        Instrument.hasMany(models.item);
        Instrument.belongsTo(models.categoria);
        Instrument.belongsTo(models.tipoEval);
        Instrument.belongsToMany(models.factor, {through: 'instrumentFactor'});
        Instrument.hasMany(models.evaluacion); //un Instrumento tiene Muchas Evaluaciones
        //Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
    };
 
    return Instrument;
}