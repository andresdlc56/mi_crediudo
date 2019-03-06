module.exports = function(sequelize, Sequelize) {
 
    var Noticia = sequelize.define('noticia', {
        titulo: {
            type: Sequelize.STRING
        },
        resumen: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        descripcion: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        urlImg: {
            type: Sequelize.STRING
        }
    });
    // Class Method
    Noticia.associate = function (models) {
        
    };
 
    return Noticia;
}