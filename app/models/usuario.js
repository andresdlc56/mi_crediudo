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
        Usuario.belongsTo(models.rol);
        Usuario.belongsTo(models.nucleo); //un Usuario pertenece a un Nucleo
        Usuario.belongsTo(models.unidad); //un Usuario pertenece a una Unidad
        //Usuario.belongsToMany(models.evaluacion, {through: 'evaluacionUsuario'});
        Usuario.belongsTo(models.cargo);
        Usuario.hasMany(models.evaluacionUsuario);
        //Usuario.belongsToMany(models.item, {through: 'itemUsuario', foreignKey: 'usuarioId'});
        Usuario.hasMany(models.observacion);
        Usuario.belongsToMany(models.factor, {through: 'factorUsuario'});

    };
        
    return Usuario;
}