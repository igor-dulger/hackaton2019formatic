const AddressIndex = artifacts.require('AddressIndexLibMock');
const exceptions = require("../helpers/expectThrow");
const events = require("../helpers/expectEvent");
const BN = web3.utils.BN;
const zeroAddress = "0x0000000000000000000000000000000000000000"
contract('AddressIndex', function ([_, addr1, addr2, addr3, owner]){

    beforeEach(async function (){
        this.mock = await AddressIndex.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('add index', async function (){
        it('should add non zero index', async function (){
            await this.mock.add(addr1, 1, { from: owner });
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);
        });

        it('should add several indexes', async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await this.mock.add(addr2, 2, { from: owner });
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);
            result = await this.mock.getId.call(addr2);
            assert.equal(result, 2);
        });

        it('should raise exception when you try index existing id', async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await exceptions.expectThrow(
                this.mock.add(addr2, 1, { from: owner }),
                exceptions.errTypes.revert,
                "This id is already used"
            );
        });

        it('should raise exception when you try to reuse index', async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await exceptions.expectThrow(
                this.mock.add(addr1, 2, { from: owner }),
                exceptions.errTypes.revert,
                "This index is already used"
            );
        });

        it('should raise exception when empty address is used', async function (){
            await exceptions.expectThrow(
                this.mock.add(zeroAddress, 1, { from: owner }),
                exceptions.errTypes.revert,
                "index can't be empty"
            );
        });

        it('should raise exception when empty id is used', async function (){
            await exceptions.expectThrow(
                this.mock.add(addr3, 0, { from: owner }),
                exceptions.errTypes.revert,
                "id can't be empty"
            );
        });

    });

    context('update index', async function (){
        beforeEach(async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await this.mock.add(addr2, 2, { from: owner });
        });

        it('should update non zero index', async function (){
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);

            await this.mock.update(addr3, 1, { from: owner });
            result = await this.mock.getId.call(addr3);
            assert.equal(result, 1);
            result = await this.mock.getIndex.call(1);
            assert.equal(result, addr3);
        });

        it('should return empty old index', async function (){
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);
            await this.mock.update(addr3, 1, { from: owner });
            result = await this.mock.getId.call(addr3);
            assert.equal(result, 1);
            result = await this.mock.getId.call(addr1);
            assert.equal(result, 0);
        });

        it('should raise exception when update unexisting id', async function (){
            await exceptions.expectThrow(
                this.mock.update(addr3, 3, { from: owner }),
                exceptions.errTypes.revert,
                "Id must exists"
            );
        });

        it('should raise exception when you try to reuse index', async function (){
            await exceptions.expectThrow(
                this.mock.update(addr1, 3, { from: owner }),
                exceptions.errTypes.revert,
                "This index is already used"
            );
        });

        it('should raise exception when empty address is used', async function (){
            await exceptions.expectThrow(
                this.mock.update(zeroAddress, 1, { from: owner }),
                exceptions.errTypes.revert,
                "index can't be empty"
            );
        });
    });

    context('remove index', async function (){

        beforeEach(async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await this.mock.add(addr2, 2, { from: owner });
        });

        it('should remove non zero id', async function (){
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);
            result = await this.mock.getIndex.call(1);
            assert.equal(result, addr1);

            await this.mock.remove(addr1, { from: owner });

            result = await this.mock.getId.call(addr1);
            assert.equal(result, 0);

            result = await this.mock.getIndex.call(1);
            assert.equal(result, 0);
        });

        it('should remove several indexes', async function (){
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);
            result = await this.mock.getId.call(addr2);
            assert.equal(result, 2);

            await this.mock.remove(addr1, { from: owner });
            await this.mock.remove(addr2, { from: owner });

            result = await this.mock.getId.call(addr1);
            assert.equal(result, 0);
            result = await this.mock.getId.call(addr2);
            assert.equal(result, 0);
        });

        it('should raise exception when you try remove zero index', async function (){
            await exceptions.expectThrow(
                this.mock.remove(zeroAddress, { from: owner }),
                exceptions.errTypes.revert,
                "Index must exist"
            );
        });

        it('should raise exception when you try remove unexisting index', async function (){
            await exceptions.expectThrow(
                this.mock.remove(addr3, { from: owner }),
                exceptions.errTypes.revert,
                "Index must exist"
            );
        });
    });

    context('get id', async function (){

        beforeEach(async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await this.mock.add(addr2, 2, { from: owner });
        });

        it('should return valid id', async function (){
            let result = await this.mock.getId.call(addr1);
            assert.equal(result, 1);
        });
        it('should return 0 for unexisting index', async function (){
            let result = await this.mock.getId.call(addr3);
            assert.equal(result, 0);
        });
    });

    context('get index', async function (){

        beforeEach(async function (){
            await this.mock.add(addr1, 1, { from: owner });
            await this.mock.add(addr2, 2, { from: owner });
        });

        it('should return valid index', async function (){
            let result = await this.mock.getIndex.call(1);
            assert.equal(result, addr1);
        });
        it('should return 0 for unexisting id', async function (){
            let result = await this.mock.getIndex.call(3);
            assert.equal(result, zeroAddress);
        });
    });
});
