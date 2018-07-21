module.exports = function(sequelize, Sequelize) {
 
    var Categoria = sequelize.define('categoria', {
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    // Class Method
    Categoria.associate = function (models) {
        Categoria.hasMany(models.instrument);
        Categoria.hasMany(models.evaluacion); //una Categoria tiene Muchas Evaluaciones 
    };
 
    return Categoria;
}