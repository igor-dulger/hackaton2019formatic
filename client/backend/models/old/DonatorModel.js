var Hash = require("./HashModel");
var Group = require("./GroupModel");
var BaseModel = require("./BaseModel");

module.exports = BaseModel.extend({
    tableName: 'donators',
    hasTimestamps: true,
    groups: function() {
      return this.belongsToMany(Group);
    },
    hash: function() {
        return this.hasOne(Hash);
    }
});
