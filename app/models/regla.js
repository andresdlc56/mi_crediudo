module.exports = function(sequelize, Sequelize) {
 
    var Regla = sequelize.define('regla', {
        titulo: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        descripcion: {
            type: Sequelize.STRING
        },
        pdf: {
            type: Sequelize.STRING
        }
    });
    // Class Method
    Regla.associate = function (models) {
        
    };
 
    return Regla;
}