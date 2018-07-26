module.exports = function(sequelize, Sequelize) {
 
    var Cargo = sequelize.define('cargo', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Cargo.associate = function (models) {
        Cargo.hasOne(models.usuario);
    };
 
    return Cargo;
}