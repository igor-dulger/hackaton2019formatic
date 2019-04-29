var BaseModel = require("./BaseModel");
var Donator = require("./DonatorModel");

module.exports = BaseModel.extend({
    tableName: 'groups',
    hasTimestamps: true,
    donators: function() {
      return this.belongsToMany(Donator);
    }
});
