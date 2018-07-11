module.exports = function(sequelize, Sequelize) {
 
    var Rol = sequelize.define('rol', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Rol.associate = function (models) {
        Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
    };

    module.exports.Rol = Rol; 
    return Rol;
}