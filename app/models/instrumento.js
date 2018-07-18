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
        //Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
    };

    module.exports.Instrument = Instrument; 
    return Instrument;
}