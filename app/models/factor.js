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
        Factor.hasMany(models.factorUsuario); //un Factor tiene Muchos FactoresUsuarios
        //Factor.belongsToMany(models.usuario, {through: 'factorUsuario'});
        //Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
        //Factor.belongsToMany(models.usuario, {through: 'instrumentFactor'});
    };

    return Factor;
}