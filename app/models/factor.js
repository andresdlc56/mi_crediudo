module.exports = function(sequelize, Sequelize) {
 
    var Factor = sequelize.define('factor', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Factor.associate = function (models) {
        //Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
    };

    module.exports.Factor = Factor; 
    return Factor;
}