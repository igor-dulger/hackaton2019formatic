const List = artifacts.require('UintEnumerationLibMock');
const exceptions = require("../helpers/expectThrow");

contract('List', function ([_, owner]){

    beforeEach(async function (){
        this.mock = await List.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('add id ', async function (){
        it('should add non zero id', async function (){
            await this.mock.add(5, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });

        it('should add several non zero id', async function (){
            await this.mock.add(5, { from: owner });
            await this.mock.add(6, { from: owner });
            await this.mock.add(2, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should add several non zero id', async function (){
            await this.mock.add(5, { from: owner });
            await this.mock.add(6, { from: owner });
            await this.mock.add(2, { from: owner });
            let result = await this.mock.getNextId.call(0);
            assert.equal(result, 5);
            result = await this.mock.getNextId.call(5);
            assert.equal(result, 6);
            result = await this.mock.getNextId.call(6);
            assert.equal(result, 2);
        });

        it('should raise exception when you try add zero', async function (){
            await exceptions.expectThrow(
                this.mock.add(0, { from: owner }),
                exceptions.errTypes.revert,
                "Zero id is forbidden"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should raise exception when you try add non unique id', async function (){
            await this.mock.add(2, { from: owner }),
            await exceptions.expectThrow(
                this.mock.add(2, { from: owner }),
                exceptions.errTypes.revert,
                "this id should NOT exists in list"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });
    });

    context('remove id', async function (){
        it('should remove non zero id', async function (){
            await this.mock.add(5, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
            await this.mock.remove(5, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should remove several non zero id', async function (){
            await this.mock.add(5, { from: owner });
            await this.mock.add(6, { from: owner });
            await this.mock.add(2, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);

            await this.mock.remove(6, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.remove(5, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.remove(2, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should remove first id', async function (){
            await this.mock.add(5, { from: owner });
            await this.mock.add(6, { from: owner });
            await this.mock.add(2, { from: owner });

            assert.equal(await this.mock.getNextId.call(0), 5);
            assert.equal(await this.mock.getNextId.call(5), 6);
            assert.equal(await this.mock.getNextId.call(6), 2);
            assert.equal(await this.mock.getNextId.call(2), 0);

            await this.mock.remove(5, { from: owner });

            assert.equal(await this.mock.getNextId.call(0), 2);
            assert.equal(await this.mock.getNextId.call(2), 6);
            assert.equal(await this.mock.getNextId.call(6), 0);

            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);
        });

        it('should remove middle id', async function (){
            await this.mock.add(5, { from: owner });
            await this.mock.add(6, { from: owner });
            await this.mock.add(2, { from: owner });

            assert.equal(await this.mock.getNextId.call(0), 5);
            assert.equal(await this.mock.getNextId.call(5), 6);
            assert.equal(await this.mock.getNextId.call(6), 2);
            assert.equal(await this.mock.getNextId.call(2), 0);

            await this.mock.remove(6, { from: owner });

            assert.equal(await this.mock.getNextId.call(0), 5);
            assert.equal(await this.mock.getNextId.call(5), 2);
            assert.equal(await this.mock.getNextId.call(2), 0);

            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);
        });

        it('should remove last id', async function (){
            await this.mock.add(5, { from: owner });
            await this.mock.add(6, { from: owner });
            await this.mock.add(2, { from: owner });

            assert.equal(await this.mock.getNextId.call(0), 5);
            assert.equal(await this.mock.getNextId.call(5), 6);
            assert.equal(await this.mock.getNextId.call(6), 2);
            assert.equal(await this.mock.getNextId.call(2), 0);

            await this.mock.remove(2, { from: owner });

            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            assert.equal(await this.mock.getNextId.call(0), 5);
            assert.equal(await this.mock.getNextId.call(5), 6);
            assert.equal(await this.mock.getNextId.call(6), 0);
        });

        it('should raise exception when you try remove zero', async function (){
            await exceptions.expectThrow(
                this.mock.remove(0, { from: owner }),
                exceptions.errTypes.revert,
                "Zero id is forbidden"
            );
        });

        it('should raise exception when you try to remove non existing id', async function (){
            await this.mock.add(2, { from: owner }),
            await exceptions.expectThrow(
                this.mock.remove(5, { from: owner }),
                exceptions.errTypes.revert,
                "this id should exists in list"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);
        });

        it('should raise exception when you try to remove already removed id', async function (){
            await this.mock.add(2, { from: owner });
            await this.mock.remove(2, { from: owner });
            await exceptions.expectThrow(
                this.mock.remove(2, { from: owner }),
                exceptions.errTypes.revert,
                "this id should exists in list"
            );
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });
    });

    context('getNextId', async function (){
        it('should return 0 when try to get next id in empty list', async function (){
            let result = await this.mock.getNextId.call(0, { from: owner });
            assert.equal(result, 0);
        });

        it('should return first id', async function (){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            let result = await this.mock.getNextId.call(0);
            assert.equal(result, 2);
        });

        it('should return next id', async function (){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            await this.mock.add(4, { from: owner });
            let result = await this.mock.getNextId.call(0);
            assert.equal(result, 2);
            result = await this.mock.getNextId.call(2);
            assert.equal(result, 3);
            result = await this.mock.getNextId.call(3);
            assert.equal(result, 4);
        });

        it('should return 0 when try to get next id from last id', async function (){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            await this.mock.add(4, { from: owner });

            let result = await this.mock.getNextId.call(4);
            assert.equal(result, 0);
        });

        it('should raise exception when you try get next id from unexisting id', async function (){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            await this.mock.add(4, { from: owner });

            await exceptions.expectThrow(
                this.mock.getNextId.call(5, { from: owner }),
                exceptions.errTypes.revert,
                "this id should exists in list"
            );
        });

        it('should keep an order in next direction when you delete some element', async function (){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            await this.mock.add(4, { from: owner });
            await this.mock.add(5, { from: owner });

            await this.mock.remove(3, { from: owner });

            let result = await this.mock.getNextId.call(0);
            assert.equal(result, 2);
            result = await this.mock.getNextId.call(2);
            assert.equal(result, 5);
            result = await this.mock.getNextId.call(5);
            assert.equal(result, 4);
        });

    });

    context('itemsCount', async function (){
        it('should return zero for empty list', async function(){
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });

        it('should return correct count of items', async function(){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            await this.mock.add(4, { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should increase count of products when you add new item', async function(){
            await this.mock.add(2, { from: owner });
            let result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.add(3, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.add(4, { from: owner });
            result = await this.mock.itemsCount.call();
            assert.equal(result, 3);
        });

        it('should decrease count of items when you remove some item', async function(){
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });
            await this.mock.add(4, { from: owner });

            let result = await this.mock.itemsCount.call();
            assert.equal(result, 3);

            await this.mock.remove(2);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 2);

            await this.mock.remove(4);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 1);

            await this.mock.remove(3);
            result = await this.mock.itemsCount.call();
            assert.equal(result, 0);
        });
    });

    context('exists', async function (){
        it('should return false for empty list', async function(){
            let result = await this.mock.exists.call(1);
            assert.equal(result, false);
        });

        it('should return false for unexisting id', async function(){
            await this.mock.add(2, { from: owner });

            let result = await this.mock.exists.call(1);
            assert.equal(result, false);
        });

        it('should return true for existing id', async function(){
            await this.mock.add(2, { from: owner });

            let result = await this.mock.exists.call(2);
            assert.equal(result, true);
        });
    });

    context('statuses', async function (){

        it('should return empty array for empty list', async function(){
            let result = await this.mock.statuses.call([]);
            expect(result).to.deep.equal([]);
        });

        it('should return all falses for empty list', async function(){
            let result = await this.mock.statuses.call([1,2,3]);
            expect(result).to.deep.equal([false, false, false]);
        });

        it('should return all falses for not empty list', async function(){
            await this.mock.add(1, { from: owner });
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });

            let result = await this.mock.statuses.call([4,5,6]);
            expect(result).to.deep.equal([false, false, false]);
        });

        it('should return true for existing and false for unexisting ids', async function(){
            await this.mock.add(2, { from: owner });

            let result = await this.mock.statuses.call([1,2,3]);
            expect(result).to.deep.equal([false, true, false]);
        });

        it('should return all trues', async function(){
            await this.mock.add(1, { from: owner });
            await this.mock.add(2, { from: owner });
            await this.mock.add(3, { from: owner });

            let result = await this.mock.statuses.call([1,2,3]);
            expect(result).to.deep.equal([true, true, true]);
        });

        it('should work with uint[49] list', async function(){
            let request = []
            let expected = []
            for (var i=0; i<49; i++) {
                request.push(i)
                expected.push(false)
            }
            let result = await this.mock.statuses.call(request);
            expect(result).to.deep.equal(expected);
        });

        it('should revert because list size is more than 50', async function(){
            let list = []
            for (var i=0; i<51; i++) {
                list.push(i)
            }
            await exceptions.expectThrow(
                this.mock.statuses.call(list, { from: owner }),
                exceptions.errTypes.revert,
                "Status array can't be more than 50"
            );
        });
    });
});
