var BaseModel = require("./BaseModel");
var Donator = require("./DonatorModel");

module.exports = BaseModel.extend({
    tableName: 'hashes',
    hasTimestamps: true,
    donator: function() {
        return this.belongsTo(Donator, "id", "id");
    }
});
