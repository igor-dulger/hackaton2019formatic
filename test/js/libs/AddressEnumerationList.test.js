const List = artifacts.require('AddressEnumerationLibMock');
const exceptions = require("../helpers/expectThrow");
const helpers = require("../helpers/common");

contract('List', function ([_, owner]){
    const zeroAddress = helpers.toAddress(0);
    const id1 = helpers.toAddress(1);
    const id2 = helpers.toAddress(2);
    const id3 = helpers.toAddress(3);
    const id4 = helpers.toAddress(4);
    const id5 = helpers.toAddress(5);
    const id6 = helpers.toAddress(6);

    beforeEach(async function (){
        this.mock = await List.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('add id ', async function (){
        it('should add non zero id', async function (){
            await this.mock.add(id5, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });

        it('should add several non zero id', async function (){
            await this.mock.add(id5, { from: owner });
            await this.mock.add(id6, { from: owner });
            await this.mock.add(id2, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should add several non zero id', async function (){
            await this.mock.add(id5, { from: owner });
            await this.mock.add(id6, { from: owner });
            await this.mock.add(id2, { from: owner });
            let result = await this.mock.getNextId.call(zeroAddress);
            assert.equal(result, id5);
            result = await this.mock.getNextId.call(id5);
            assert.equal(result, id6);
            result = await this.mock.getNextId.call(id6);
            assert.equal(result, id2);
        });

        it('should raise exception when you try add zero', async function (){
            await exceptions.expectThrow(
                this.mock.add(zeroAddress, { from: owner }),
                exceptions.errTypes.revert,
                "Zero id is forbidden"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should raise exception when you try add non unique id', async function (){
            await this.mock.add(id2, { from: owner }),
            await exceptions.expectThrow(
                this.mock.add(id2, { from: owner }),
                exceptions.errTypes.revert,
                "this id should NOT exists in list"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });
    });

    context('remove id', async function (){
        it('should remove non zero id', async function (){
            await this.mock.add(id5, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
            await this.mock.remove(id5, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should remove several non zero id', async function (){
            await this.mock.add(id5, { from: owner });
            await this.mock.add(id6, { from: owner });
            await this.mock.add(id2, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);

            await this.mock.remove(id6, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.remove(id5, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.remove(id2, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should remove first id', async function (){
            await this.mock.add(id5, { from: owner });
            await this.mock.add(id6, { from: owner });
            await this.mock.add(id2, { from: owner });

            assert.equal(await this.mock.getNextId.call(zeroAddress), id5);
            assert.equal(await this.mock.getNextId.call(id5), id6);
            assert.equal(await this.mock.getNextId.call(id6), id2);
            assert.equal(await this.mock.getNextId.call(id2), zeroAddress);

            await this.mock.remove(id5, { from: owner });

            assert.equal(await this.mock.getNextId.call(zeroAddress), id2);
            assert.equal(await this.mock.getNextId.call(id2), id6);
            assert.equal(await this.mock.getNextId.call(id6), zeroAddress);

            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);
        });

        it('should remove middle id', async function (){
            await this.mock.add(id5, { from: owner });
            await this.mock.add(id6, { from: owner });
            await this.mock.add(id2, { from: owner });

            assert.equal(await this.mock.getNextId.call(zeroAddress), id5);
            assert.equal(await this.mock.getNextId.call(id5), id6);
            assert.equal(await this.mock.getNextId.call(id6), id2);
            assert.equal(await this.mock.getNextId.call(id2), zeroAddress);

            await this.mock.remove(id6, { from: owner });

            assert.equal(await this.mock.getNextId.call(zeroAddress), id5);
            assert.equal(await this.mock.getNextId.call(id5), id2);
            assert.equal(await this.mock.getNextId.call(id2), zeroAddress);

            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);
        });

        it('should remove last id', async function (){
            await this.mock.add(id5, { from: owner });
            await this.mock.add(id6, { from: owner });
            await this.mock.add(id2, { from: owner });

            assert.equal(await this.mock.getNextId.call(zeroAddress), id5);
            assert.equal(await this.mock.getNextId.call(id5), id6);
            assert.equal(await this.mock.getNextId.call(id6), id2);
            assert.equal(await this.mock.getNextId.call(id2), zeroAddress);

            await this.mock.remove(id2, { from: owner });

            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            assert.equal(await this.mock.getNextId.call(zeroAddress), id5);
            assert.equal(await this.mock.getNextId.call(id5), id6);
            assert.equal(await this.mock.getNextId.call(id6), zeroAddress);
        });

        it('should raise exception when you try remove zero', async function (){
            await exceptions.expectThrow(
                this.mock.remove(zeroAddress, { from: owner }),
                exceptions.errTypes.revert,
                "Zero id is forbidden"
            );
        });

        it('should raise exception when you try to remove non existing id', async function (){
            await this.mock.add(id2, { from: owner }),
            await exceptions.expectThrow(
                this.mock.remove(id5, { from: owner }),
                exceptions.errTypes.revert,
                "this id should exists in list"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });

        it('should raise exception when you try to remove already removed id', async function (){
            await this.mock.add(id2, { from: owner });
            await this.mock.remove(id2, { from: owner });
            await exceptions.expectThrow(
                this.mock.remove(id2, { from: owner }),
                exceptions.errTypes.revert,
                "this id should exists in list"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });
    });

    context('getNextId', async function (){
        it('should return 0 when try to get next id in empty list', async function (){
            let result = await this.mock.getNextId.call(zeroAddress, { from: owner });
            assert.equal(result, 0);
        });

        it('should return first id', async function (){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            let result = await this.mock.getNextId.call(zeroAddress);
            assert.equal(result, id2);
        });

        it('should return next id', async function (){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            await this.mock.add(id4, { from: owner });
            let result = await this.mock.getNextId.call(zeroAddress);
            assert.equal(result, id2);
            result = await this.mock.getNextId.call(id2);
            assert.equal(result, id3);
            result = await this.mock.getNextId.call(id3);
            assert.equal(result, id4);
        });

        it('should return 0 when try to get next id from last id', async function (){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            await this.mock.add(id4, { from: owner });

            let result = await this.mock.getNextId.call(id4);
            assert.equal(result, 0);
        });

        it('should raise exception when you try get next id from unexisting id', async function (){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            await this.mock.add(id4, { from: owner });

            await exceptions.expectThrow(
                this.mock.getNextId.call(id5, { from: owner }),
                exceptions.errTypes.revert,
                "this id should exists in list"
            );
        });

        it('should keep an order in next direction when you delete some element', async function (){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            await this.mock.add(id4, { from: owner });
            await this.mock.add(id5, { from: owner });

            await this.mock.remove(id3, { from: owner });

            let result = await this.mock.getNextId.call(zeroAddress);
            assert.equal(result, id2);
            result = await this.mock.getNextId.call(id2);
            assert.equal(result, id5);
            result = await this.mock.getNextId.call(id5);
            assert.equal(result, id4);
        });

    });

    context('itemsCount', async function (){
        it('should return zero for empty list', async function(){
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should return correct count of items', async function(){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            await this.mock.add(id4, { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should increase count of products when you add new item', async function(){
            await this.mock.add(id2, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.add(id3, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.add(id4, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should decrease count of items when you remove some item', async function(){
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });
            await this.mock.add(id4, { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);

            await this.mock.remove(id2);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.remove(id4);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.remove(id3);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });
    });

    context('exists', async function (){
        it('should return false for empty list', async function(){
            let result = await this.mock.exists.call(id1);
            assert.equal(result, false);
        });

        it('should return false for unexisting id', async function(){
            await this.mock.add(id2, { from: owner });

            let result = await this.mock.exists.call(id1);
            assert.equal(result, false);
        });

        it('should return true for existing id', async function(){
            await this.mock.add(id2, { from: owner });

            let result = await this.mock.exists.call(id2);
            assert.equal(result, true);
        });
    });

    context('statuses', async function (){

        it('should return empty array for empty list', async function(){
            let result = await this.mock.statuses.call([]);
            expect(result).to.deep.equal([]);
        });

        it('should return all falses for empty list', async function(){
            let result = await this.mock.statuses.call([id1, id2, id3]);
            expect(result).to.deep.equal([false, false, false]);
        });

        it('should return all falses for not empty list', async function(){
            await this.mock.add(id1, { from: owner });
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });

            let result = await this.mock.statuses.call([id4,id5,id6]);
            expect(result).to.deep.equal([false, false, false]);
        });

        it('should return true for existing and false for unexisting ids', async function(){
            await this.mock.add(id2, { from: owner });

            let result = await this.mock.statuses.call([id1, id2, id3]);
            expect(result).to.deep.equal([false, true, false]);
        });

        it('should return all trues', async function(){
            await this.mock.add(id1, { from: owner });
            await this.mock.add(id2, { from: owner });
            await this.mock.add(id3, { from: owner });

            let result = await this.mock.statuses.call([id1, id2, id3]);
            expect(result).to.deep.equal([true, true, true]);
        });

        it('should work with uint[49] list', async function(){
            let request = []
            let expected = []
            for (var i=0; i<49; i++) {
                request.push(helpers.toAddress(i))
                expected.push(false)
            }
            let result = await this.mock.statuses.call(request);
            expect(result).to.deep.equal(expected);
        });

        it('should revert because list size is more than 50', async function(){
            let list = []
            for (var i=0; i<51; i++) {
                list.push(helpers.toAddress(i))
            }
            await exceptions.expectThrow(
                this.mock.statuses.call(list, { from: owner }),
                exceptions.errTypes.revert,
                "Status array can't be more than 50"
            );
        });
    });
});
