const Entity = artifacts.require('AddressLibMock');
const exceptions = require("../helpers/expectThrow");
const events = require("../helpers/expectEvent");
const BN = web3.utils.BN;

contract('Address lib', function ([_, owner]){

    beforeEach(async function (){
        this.mock = await Entity.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('convert address', async function (){
        it('should return correct string representatin of address', async function (){
            let result = await this.mock.addressToString.call(owner, { from: owner });
            assert.equal(result, owner.toLowerCase());
        });
    });
});
