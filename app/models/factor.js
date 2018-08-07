module.exports = function(sequelize, Sequelize) {
 
    var Factor = sequelize.define('factor', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Factor.associate = function (models) {
        Factor.hasMany(models.item);
        Factor.belongsToMany(models.instrument, {through: 'instrumentFactor'});
        //Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
        //Factor.belongsToMany(models.usuario, {through: 'instrumentFactor'});
    };

    return Factor;
}