const StringIndex = artifacts.require('StringIndexLibMock');
const exceptions = require("../helpers/expectThrow");
const events = require("../helpers/expectEvent");
const BN = web3.utils.BN;

contract('StringIndex', function ([_, owner]){

    beforeEach(async function (){
        this.mock = await StringIndex.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('add index', async function (){
        it('should add non zero index', async function (){
            await this.mock.add("index1", 1, { from: owner });
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);
        });

        it('should add several indexes', async function (){
            await this.mock.add("index1", 1, { from: owner });
            await this.mock.add("index2", 2, { from: owner });
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);
            result = await this.mock.getId.call("index2");
            assert.equal(result, 2);
        });

        it('should raise exception when you try index existing id', async function (){
            await this.mock.add("index1", 1, { from: owner });
            await exceptions.expectThrow(
                this.mock.add("index2", 1, { from: owner }),
                exceptions.errTypes.revert,
                "This id is already used"
            );
        });

        it('should raise exception when you try to reuse index', async function (){
            await this.mock.add("index1", 1, { from: owner });
            await exceptions.expectThrow(
                this.mock.add("index1", 2, { from: owner }),
                exceptions.errTypes.revert,
                "This index is already used"
            );
        });

        it('should raise exception when empty index is used', async function (){
            await exceptions.expectThrow(
                this.mock.add("", 1, { from: owner }),
                exceptions.errTypes.revert,
                "index can't be empty"
            );
        });

        it('should raise exception when empty id is used', async function (){
            await exceptions.expectThrow(
                this.mock.add("index3", 0, { from: owner }),
                exceptions.errTypes.revert,
                "id can't be empty"
            );
        });

    });

    context('update index', async function (){
        beforeEach(async function (){
            await this.mock.add("index1", 1, { from: owner });
            await this.mock.add("index2", 2, { from: owner });
        });

        it('should update non zero index', async function (){
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);

            await this.mock.update("index3", 1, { from: owner });
            result = await this.mock.getId.call("index3");
            assert.equal(result, 1);
            result = await this.mock.getIndex.call(1);
            assert.equal(result, "index3");
        });

        it('should return empty old index', async function (){
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);
            await this.mock.update("index3", 1, { from: owner });
            result = await this.mock.getId.call("index3");
            assert.equal(result, 1);
            result = await this.mock.getId.call("index1");
            assert.equal(result, 0);
        });

        it('should raise exception when update unexisting id', async function (){
            await exceptions.expectThrow(
                this.mock.update("index3", 3, { from: owner }),
                exceptions.errTypes.revert,
                "Id must exists"
            );
        });

        it('should raise exception when you try to reuse index', async function (){
            await exceptions.expectThrow(
                this.mock.update("index1", 3, { from: owner }),
                exceptions.errTypes.revert,
                "This index is already used"
            );
        });

        it('should raise exception when empty index is used', async function (){
            await exceptions.expectThrow(
                this.mock.update("", 1, { from: owner }),
                exceptions.errTypes.revert,
                "index can't be empty"
            );
        });
    });

    context('remove index', async function (){

        beforeEach(async function (){
            await this.mock.add("index1", 1, { from: owner });
            await this.mock.add("index2", 2, { from: owner });
        });

        it('should remove non zero id', async function (){
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);
            result = await this.mock.getIndex.call(1);
            assert.equal(result, "index1");

            await this.mock.remove("index1", { from: owner });

            result = await this.mock.getId.call("index1");
            assert.equal(result, 0);

            result = await this.mock.getIndex.call(1);
            assert.equal(result, 0);
        });

        it('should remove several indexes', async function (){
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);
            result = await this.mock.getId.call("index2");
            assert.equal(result, 2);

            await this.mock.remove("index1", { from: owner });
            await this.mock.remove("index2", { from: owner });

            result = await this.mock.getId.call("index1");
            assert.equal(result, 0);
            result = await this.mock.getId.call("index2");
            assert.equal(result, 0);
        });

        it('should raise exception when you try remove zero index', async function (){
            await exceptions.expectThrow(
                this.mock.remove("", { from: owner }),
                exceptions.errTypes.revert,
                "Index must exist"
            );
        });

        it('should raise exception when you try remove unexisting index', async function (){
            await exceptions.expectThrow(
                this.mock.remove("index3", { from: owner }),
                exceptions.errTypes.revert,
                "Index must exist"
            );
        });
    });

    context('get id', async function (){

        beforeEach(async function (){
            await this.mock.add("index1", 1, { from: owner });
            await this.mock.add("index2", 2, { from: owner });
        });

        it('should return valid id', async function (){
            let result = await this.mock.getId.call("index1");
            assert.equal(result, 1);
        });
        it('should return 0 for unexisting index', async function (){
            let result = await this.mock.getId.call("index3");
            assert.equal(result, 0);
        });
    });

    context('get index', async function (){

        beforeEach(async function (){
            await this.mock.add("index1", 1, { from: owner });
            await this.mock.add("index2", 2, { from: owner });
        });

        it('should return valid index', async function (){
            let result = await this.mock.getIndex.call(1);
            assert.equal(result, "index1");
        });
        it('should return 0 for unexisting id', async function (){
            let result = await this.mock.getIndex.call(3);
            assert.equal(result, "");
        });
    });
});
