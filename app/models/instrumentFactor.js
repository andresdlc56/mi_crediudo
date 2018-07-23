module.exports = function(sequelize, Sequelize) {
 
    var instrumentFactor = sequelize.define('instrumentFactor', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    // Class Method
    instrumentFactor.associate = function (models) {
        
    };
 
    return instrumentFactor;
}