module.exports = function(sequelize, Sequelize) {
 
    var Usuario = sequelize.define('usuario', {
 
        cedula: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
 
        nombre: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        apellido: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        last_login: {
            type: Sequelize.DATE
        }
    });
    // Class Method
    Usuario.associate = function (models) {
       
    };
    
    module.exports.Usuario = Usuario;    
    return Usuario;
}


