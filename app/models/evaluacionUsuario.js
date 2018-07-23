module.exports = function(sequelize, Sequelize) {
 
    var evaluacionUsuario = sequelize.define('evaluacionUsuario', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        calificacion: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        }, 
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    // Class Method
    evaluacionUsuario.associate = function (models) {
    
    };
 
    return evaluacionUsuario;
}