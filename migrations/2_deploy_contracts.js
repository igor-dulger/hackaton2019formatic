var HallOfFame = artifacts.require("./HallOfFame.sol");

module.exports = function(deployer) {
  deployer.deploy(HallOfFame);
};
