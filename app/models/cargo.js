module.exports = function(sequelize, Sequelize) {
 
    var Cargo = sequelize.define('cargo', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Cargo.associate = function (models) {
        Cargo.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
    };

    module.exports.Cargo = Cargo; 
    return Cargo;
}