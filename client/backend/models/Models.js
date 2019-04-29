var db = require("../orms/bookshelf");

var Admin = db.Model.extend({
    tableName: 'admins',
    hasTimestamps: true
});

var Group = db.Model.extend({
    tableName: 'groups',
    hasTimestamps: true,
    donators: function() {
      return this.belongsToMany(Donator).withPivot(['position']);
    }
});

var Donator = db.Model.extend({
    tableName: 'donators',
    hasTimestamps: true,
    groups: function() {
      return this.belongsToMany(Group).withPivot(['position']);
    },
    hash: function() {
        return this.hasOne(Hash);
    }
});

var Hash = db.Model.extend({
    tableName: 'hashes',
    hasTimestamps: true,
    donator: function() {
        return this.belongsTo(Donator, "id", "id");
    }
});

module.exports = {
    Admin: Admin,
    Group: Group,
    Donator: Donator,
    Hash: Hash
}
