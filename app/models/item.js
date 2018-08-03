module.exports = function(sequelize, Sequelize) {
 
    var Item = sequelize.define('item', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        valor: {
            type: Sequelize.INTEGER,
        }
    });
    // Class Method
    Item.associate = function (models) {
        Item.belongsTo(models.instrument);
        Item.belongsTo(models.factor);
        //Rol.hasMany(models.usuario);
        //Cargo.belongsToMany(models.empleado, {through: 'empleadoCargo', foreignKey: 'cargoId'});
        Item.belongsToMany(models.usuario, {through: 'itemUsuario', foreignKey: 'itemId'});
    };

    module.exports.Item = Item; 
    return Item;
}