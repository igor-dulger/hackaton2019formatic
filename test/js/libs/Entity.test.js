const Entity = artifacts.require('EntityLibMock');
const exceptions = require("../helpers/expectThrow");
const events = require("../helpers/expectEvent");
const BN = web3.utils.BN;

contract('Entity', function ([_, owner]){

    function shouldMatchEntity(expected, actual){
        assert.equal(expected[0], actual[0]);
        assert.equal(expected[1], actual[1]);
    }

    beforeEach(async function (){
        this.mock = await Entity.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('add entity', async function (){
        it('should add non zero id', async function (){
            await this.mock.add("Test entity", { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });

        it('should show min - max gas consumption', async function (){
            let data = "";
            for (var i=0; i<10000;i+=1000) {
                data = ""
                for (var j=0; j<i; j++) {
                    data += "a";
                }
                let gas = await this.mock.add.estimateGas(data, { from: owner });
                if (gas > 6000000) {
                    break;
                }
                console.log("add entity gas estimation for " + data.length + " bytes of data = " + gas + " units");
            }
        });

        it('should add several non zero id', async function (){
            await this.mock.add("Test entity 1", { from: owner });
            await this.mock.add("Test entity 2", { from: owner });
            await this.mock.add("Test entity 3", { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });
    });

    context('update entity', async function (){

        it('should update' , async function (){
            await this.mock.add("Test entity 1", { from: owner });

            var result = await this.mock.get.call(1);
            shouldMatchEntity(result, [1, "Test entity 1", 1])

            await this.mock.update(1, "Test entity 2", { from: owner });

            result = await this.mock.get.call(1);
            shouldMatchEntity(result, [1, "Test entity 2", 2])
        });

        it('should increment version', async function (){
            await this.mock.add("Test entity 1", { from: owner });
            var result = await this.mock.get.call(1);
            shouldMatchEntity(result, [1, "Test entity 1", 1])

            await this.mock.update(1, "Test entity 2", { from: owner });
            result = await this.mock.get.call(1);
            shouldMatchEntity(result, [1, "Test entity 2", 2])

            await this.mock.update(1, "Test entity 2", { from: owner });
            result = await this.mock.get.call(1);
            shouldMatchEntity(result, [1, "Test entity 2", 3])
        });


        it('should raise exception when you try update a zero id', async function (){
            await exceptions.expectThrow(
                this.mock.update(0, "Test entity 1", { from: owner }),
                exceptions.errTypes.revert,
                "id doesn't exist"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should raise exception when you try to update unexisting id', async function (){
            await this.mock.add("Test entity 1", { from: owner });
            await exceptions.expectThrow(
                this.mock.update(2, "Test entity 1", { from: owner }),
                exceptions.errTypes.revert,
                "id doesn't exist"
            );
        });
    });

    context('remove id', async function (){
        it('should remove non zero id', async function (){
            await this.mock.add("Test entity 1", { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
            await this.mock.remove(1, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should remove several non zero id', async function (){
            await this.mock.add("Test entity 1",  { from: owner });
            await this.mock.add("Test entity 2",  { from: owner });
            await this.mock.add("Test entity 3",  { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);

            await this.mock.remove(1, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.remove(2, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.remove(3, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should raise exception when you try remove zero', async function (){
            await exceptions.expectThrow(
                this.mock.remove(0, { from: owner }),
                exceptions.errTypes.revert,
                "id doesn't exist"
            );
        });

        it('should raise exception when you try to remove non existing id', async function (){
            await this.mock.add("Test entity 1",  { from: owner });
            await exceptions.expectThrow(
                this.mock.remove(5, { from: owner }),
                exceptions.errTypes.revert,
                "id doesn't exist"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });

        it('should raise exception when you try to remove already removed id', async function (){
            await this.mock.add("Test entity 1",  { from: owner });
            await this.mock.remove(1, { from: owner });
            await exceptions.expectThrow(
                this.mock.remove(1, { from: owner }),
                exceptions.errTypes.revert,
                "id doesn't exist"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });
    });

    context('itemsCount', async function (){
        it('should return zero for empty list', async function(){
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should return correct count of items', async function(){
            await this.mock.add("Test entity 1", { from: owner });
            await this.mock.add("Test entity 2", { from: owner });
            await this.mock.add("Test entity 3", { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should increase count of products when you add new item', async function(){
            await this.mock.add("Test entity 1", { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.add("Test entity 2", { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.add("Test entity 3", { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should decrease count of items when you remove some item', async function(){
            await this.mock.add("Test entity 1", { from: owner });
            await this.mock.add("Test entity 2", { from: owner });
            await this.mock.add("Test entity 3", { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);

            await this.mock.remove(2);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.remove(3);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.remove(1);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });
    });

    context('get', async function (){
        it('should return correct entity', async function(){
            await this.mock.add("Test entity 1", { from: owner });
            await this.mock.add("Test entity 2", { from: owner });
            await this.mock.add("Test entity 3", { from: owner });

            let result = await this.mock.get.call(1);
            shouldMatchEntity(result, [1, "Test entity 1", 1]);

            result = await this.mock.get.call(2);
            shouldMatchEntity(result, [2, "Test entity 2", 1]);

            result = await this.mock.get.call(3);
            shouldMatchEntity(result, [3, "Test entity 3", 1]);
        });
    });

    context('exists', async function (){
        it('should return false for empty list', async function(){
            let result = await this.mock.exists.call(1);
            assert.equal(result, false);
        });

        it('should return false for unexisting id', async function(){
            await this.mock.add("Test entity 1", { from: owner });

            let result = await this.mock.exists.call(2);
            assert.equal(result, false);
        });

        it('should return true for existing id', async function(){
            await this.mock.add("Test entity 1", { from: owner });

            let result = await this.mock.exists.call(1);
            assert.equal(result, true);
        });
    });
});
