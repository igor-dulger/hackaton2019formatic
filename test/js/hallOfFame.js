const HallOfFame = artifacts.require("./HallOfFame.sol");
const exceptions = require("./helpers/expectThrow");
const events = require("./helpers/expectEvent");
const HallOfFameABI = require("../../client/src/contracts/HallOfFame.json").abi;

const BN = web3.utils.BN;

contract("HallOfFame", function ([_, admin1, admin2, admin3, owner]) {

    function shouldMatchEntity(expected, actual){
        assert.equal(expected[0], actual[0]);
        assert.equal(expected[1], actual[1]);
        assert.equal(expected[2], actual[2]);
        assert.equal(expected[3], actual[3]);
    }

    beforeEach(async function (){
        this.contract = await HallOfFame.new({ from: owner });
    });

    context('general', async function (){
        it('should exists', async function (){
        });
    });

    context('Test admins', async function (){

        context('add admin', async function (){
            it('should add an admin', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                let result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin1", 1, admin1]);
            });

            it('should raise exception when is not owner', async function (){
                await exceptions.expectThrow(
                    this.contract.addAdmin("admin1", admin1, { from: admin2 }),
                    exceptions.errTypes.revert,
                    ""
                );
            });

            it('should emit Add admin event', async function (){
                await events.inTransaction(
                    this.contract.addAdmin("Admin1", admin1, { from: owner }),
                    'AdminAdded',
                    {
                        actor: owner,
                        id: new BN(1),
                        admin: admin1
                    }
                );
            });
        });

        context('update admin', async function (){
            it('should update an admin', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                let result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin1", 1, admin1]);

                await this.contract.updateAdmin(1, "admin2", admin1, { from: owner });
                result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin2", 2, admin1]);
            });

            it('should update an admins address', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                let result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin1", 1, admin1]);

                await this.contract.updateAdmin(1, "admin2", admin3, { from: owner });
                result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin2", 2, admin3]);
            });


            it('should raise exception when is not owner', async function (){
                await exceptions.expectThrow(
                    this.contract.updateAdmin(1, "admin1", admin1, { from: admin2 }),
                    exceptions.errTypes.revert,
                    ""
                );
            });

            it('should emit Update admin event', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });

                await events.inTransaction(
                    this.contract.updateAdmin(1, "Admin1", admin1, { from: owner }),
                    'AdminUpdated',
                    {
                        actor: owner,
                        id: new BN(1)
                    }
                );
            });
        });

        context('remove admin', async function (){
            it('should remove an admin', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                let result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin1", 1, admin1]);

                await this.contract.removeAdmin(1, { from: owner });
                result = await this.contract.areAdmins.call([1]);
                assert.equal(result[0], false);
            });

            it('should raise exception when is not owner', async function (){
                await exceptions.expectThrow(
                    this.contract.removeAdmin(1, { from: admin2 }),
                    exceptions.errTypes.revert,
                    ""
                );
            });

            it('should emit Remove admin event', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });

                await events.inTransaction(
                    this.contract.removeAdmin(1, { from: owner }),
                    'AdminDeleted',
                    {
                        actor: owner,
                        id: new BN(1)
                    }
                );
            });
        });

        context('Get admin', async function (){
            it('should get an admin', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                await this.contract.addAdmin("admin2", admin2, { from: owner });
                let result = await this.contract.getAdmin.call(1);
                shouldMatchEntity(result, [1, "admin1", 1, admin1]);
            });
        });

        context('Get next admin', async function (){
            it('should get a next admin id', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                await this.contract.addAdmin("admin2", admin2, { from: owner });
                let result = await this.contract.nextAdmin.call(0);
                assert.equal(result, 1);
                result = await this.contract.nextAdmin.call(1);
                assert.equal(result, 2);
            });
        });

        context('Are admins', async function (){
            it('should return valid list of admins statuses', async function (){
                await this.contract.addAdmin("admin1", admin1, { from: owner });
                await this.contract.addAdmin("admin2", admin2, { from: owner });
                await this.contract.addAdmin("admin3", admin3, { from: owner });
                let result = await this.contract.areAdmins.call([1,2,3,4,5]);
                expect(result).to.deep.equal([true, true, true, false, false]);
            });
        });
    });

    context('Test groups', async function (){

        beforeEach(async function (){
            await this.contract.addAdmin("admin1", admin1, { from: owner });
        });

        context('add group', async function (){

            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.addGroup("group1", "group1", { from: admin2 }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should add an group', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group1", 1, "group1"]);
            });

            it('should emit Add group event', async function (){
                await events.inTransaction(
                    this.contract.addGroup("group1", "group1", { from: admin1 }),
                    'GroupAdded',
                    {
                        actor: admin1,
                        id: new BN(1),
                        groupCode: "group1"
                    }
                );
            });
        });

        context('update group', async function (){
            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.updateGroup(1, "group2", "group1", { from: admin2 }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should update an group', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                let result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group1", 1, "group1"]);

                await this.contract.updateGroup(1, "group2", "group1", { from: admin1 });
                result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group2", 2, "group1"]);
            });

            it('should update groups code', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                let result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group1", 1, "group1"]);

                await this.contract.updateGroup(1, "group2", "group2", { from: admin1 });
                result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group2", 2, "group2"]);
            });

            it('should emit Update group event', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });

                await events.inTransaction(
                    this.contract.updateGroup(1, "group2", "group2", { from: admin1 }),
                    'GroupUpdated',
                    {
                        actor: admin1,
                        id: new BN(1)
                    }
                );
            });
        });

        context('remove group', async function (){

            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.removeGroup(1, { from: owner }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should raise exception when group has donators', async function (){

                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                await this.contract.linkToGroups(1, [], [1], { from: admin1 });

                await exceptions.expectThrow(
                    this.contract.removeGroup(1, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "Can't delete non empty group"
                );
            });

            it('should remove a group', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                let result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group1", 1, "group1"]);

                await this.contract.removeGroup(1, { from: admin1 });
                result = await this.contract.areGroups.call([1]);
                assert.equal(result[0], false);
            });

            it('should emit Remove group event', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });

                await events.inTransaction(
                    this.contract.removeGroup(1, { from: admin1 }),
                    'GroupDeleted',
                    {
                        actor: admin1,
                        id: new BN(1)
                    }
                );
            });
        });

        context('Get group', async function (){
            it('should get an group', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                await this.contract.addGroup("group2", "group2", { from: admin1 });
                let result = await this.contract.getGroup.call(1);
                shouldMatchEntity(result, [1, "group1", 1, "group1"]);
            });
        });

        context('Get next group', async function (){
            it('should get a next group id', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                await this.contract.addGroup("group2", "group2", { from: admin1 });
                result = await this.contract.nextGroup.call(1);
                assert.equal(result, 2);
            });
        });

        context('Are groups', async function (){
            it('should return valid list of groups statuses', async function (){
                await this.contract.addGroup("group1", "group1", { from: admin1 });
                await this.contract.addGroup("group2", "group2", { from: admin1 });
                await this.contract.addGroup("group3", "group3", { from: admin1 });
                let result = await this.contract.areGroups.call([1,2,3,4,5]);
                expect(result).to.deep.equal([true, true, true, false, false]);
            });
        });
    });

    context('Test donators', async function (){
        beforeEach(async function (){
            await this.contract.addAdmin("admin1", admin1, { from: owner });
            await this.contract.addGroup("group1", "group1", { from: admin1 });
            await this.contract.addGroup("group2", "group2", { from: admin1 });
            await this.contract.addGroup("group3", "group3", { from: admin1 });
        });

        context('add donator', async function (){

            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.addDonator("donator1", "donator1", { from: admin2 }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should add an donator', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);
            });

            it('should emit Add donator event', async function (){
                await events.inTransaction(
                    this.contract.addDonator("donator1", "donator1", { from: admin1 }),
                    'DonatorAdded',
                    {
                        actor: admin1,
                        id: new BN(1),
                        externalId: "donator1"
                    }
                );
            });
        });

        context('add donator and link groups', async function (){

            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.addDonatorAndLinkGroups("donator1", "donator1", [], { from: admin2 }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should add an donator and link groups', async function (){
                await this.contract.addDonatorAndLinkGroups("donator1", "donator1", [1,3], { from: admin1 });
                result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);
                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([true, false, true]);
            });

            it('should emit Add donator event', async function (){
                await events.inTransaction(
                    this.contract.addDonatorAndLinkGroups("donator1", "donator1", [1], { from: admin1 }),
                    'DonatorAdded',
                    {
                        actor: admin1,
                        id: new BN(1),
                        externalId: "donator1"
                    }
                );
            });
            it('should emit DonatorAddedToGroups event', async function (){
                await events.inTransaction(
                    this.contract.addDonatorAndLinkGroups("donator1", "donator1", [1], { from: admin1 }),
                    'DonatorAddedToGroups',
                    {
                        actor: admin1,
                        donatorId: new BN(1),
                        groupIds: [new BN(1)]
                    }
                );
            });
        });

        context('update donator', async function (){
            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.updateDonator(1, "donator2", "donator1", { from: admin2 }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should update an donator', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                let result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);

                await this.contract.updateDonator(1, "donator2", "donator1", { from: admin1 });
                result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator2", 2, "donator1"]);
            });

            it('should update a donators external id', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                let result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);

                await this.contract.updateDonator(1, "donator2", "donator2", { from: admin1 });
                result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator2", 2, "donator2"]);
            });

            it('should emit Update donator event', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });

                await events.inTransaction(
                    this.contract.updateDonator(1, "donator2", "donator2", { from: admin1 }),
                    'DonatorUpdated',
                    {
                        actor: admin1,
                        id: new BN(1)
                    }
                );
            });
        });


        context('update donator and link groups', async function (){
            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.updateDonatorAndLinkGroups(1, "donator2", "donator1", [], [], { from: admin2 }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should update an donator and link groups', async function (){

                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                let result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);
                await this.contract.linkToGroups(1, [], [1, 3], { from: admin1 });
                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([true, false, true]);

                await this.contract.updateDonatorAndLinkGroups(1, "donator2", "donator1", [1], [2], { from: admin1 });
                result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator2", 2, "donator1"]);
                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([false, true, true]);
            });

            it('should emit Update donator event', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });

                await events.inTransaction(
                    this.contract.updateDonatorAndLinkGroups(1, "donator2", "donator2", [], [], { from: admin1 }),
                    'DonatorUpdated',
                    {
                        actor: admin1,
                        id: new BN(1)
                    }
                );
            });
            it('should emit DonatorRemovedFromGroups event', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.linkToGroups(1, [], [1, 3], { from: admin1 });
                await events.inTransaction(
                    this.contract.updateDonatorAndLinkGroups(1, "donator1", "donator1", [1], [], { from: admin1 }),
                    'DonatorRemovedFromGroups',
                    {
                        actor: admin1,
                        donatorId: new BN(1),
                        groupIds: [new BN(1)]
                    }
                );
            });

            it('should emit DonatorAddedToGroups event', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.linkToGroups(1, [], [1, 3], { from: admin1 });
                await events.inTransaction(
                    this.contract.updateDonatorAndLinkGroups(1, "donator1", "donator1", [], [2], { from: admin1 }),
                    'DonatorAddedToGroups',
                    {
                        actor: admin1,
                        donatorId: new BN(1),
                        groupIds: [new BN(2)]
                    }
                );
            });
        });

        context('remove donator', async function (){

            it('should raise exception when is not admin', async function (){
                await exceptions.expectThrow(
                    this.contract.removeDonator(1, { from: owner }),
                    exceptions.errTypes.revert,
                    "You are not admin"
                );
            });

            it('should remove an donator', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                let result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);

                await this.contract.removeDonator(1, { from: admin1 });
                result = await this.contract.areDonators.call([1]);
                assert.equal(result[0], false);
            });

            it('should emit Remove donator event', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });

                await events.inTransaction(
                    this.contract.removeDonator(1, { from: admin1 }),
                    'DonatorDeleted',
                    {
                        actor: admin1,
                        id: new BN(1)
                    }
                );
            });

            it('should unassign donator from groups when delete a donator', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.linkToGroups(1, [], [1, 2], { from: admin1 });

                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([true, true, false]);

                this.contract.removeDonator(1, { from: admin1 });

                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([false, false, false]);
            });


            it('should emit DonatorRemovedFromGroups event when delete a donator', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.linkToGroups(1, [], [1, 2], { from: admin1 });

                await events.inTransaction(
                    this.contract.removeDonator(1, { from: admin1 }),
                    'DonatorRemovedFromGroups',
                    {
                        actor: admin1,
                        donatorId: new BN(1)
                    }
                );
            });
        });

        context('Get donator', async function (){
            it('should get an donator', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.addDonator("donator2", "donator2", { from: admin1 });
                let result = await this.contract.getDonator.call(1);
                shouldMatchEntity(result, [1, "donator1", 1, "donator1"]);
            });
        });

        context('Get next donator', async function (){
            it('should get a next donator id', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.addDonator("donator2", "donator2", { from: admin1 });
                result = await this.contract.nextDonator.call(1);
                assert.equal(result, 2);
            });
        });

        context('Are donators', async function (){
            it('should return valid list of donators statuses', async function (){
                await this.contract.addDonator("donator1", "donator1", { from: admin1 });
                await this.contract.addDonator("donator2", "donator2", { from: admin1 });
                await this.contract.addDonator("donator3", "donator3", { from: admin1 });
                let result = await this.contract.areDonators.call([1,2,3,4,5]);
                expect(result).to.deep.equal([true, true, true, false, false]);
            });
        });
    });

    context('Test donators in groups', async function (){
        beforeEach(async function (){
            await this.contract.addAdmin("admin1", admin1, { from: owner });

            await this.contract.addDonator("donator1", "donator1", { from: admin1 });
            await this.contract.addDonator("donator2", "donator2", { from: admin1 });
            await this.contract.addDonator("donator3", "donator3", { from: admin1 });
            await this.contract.addDonator("donator4", "donator4", { from: admin1 });
            await this.contract.addDonator("donator5", "donator5", { from: admin1 });

            await this.contract.addGroup("group1", "group1", { from: admin1 });
            await this.contract.addGroup("group2", "group2", { from: admin1 });
            await this.contract.addGroup("group3", "group3", { from: admin1 });
        });

        context('add a donator to groups', async function (){
            it('should revert if add array is too big', async function (){
                let tooBigArray = new Array(51);
                await exceptions.expectThrow(
                    this.contract.linkToGroups(1, tooBigArray.fill(5), [2], { from: admin1 }),
                    exceptions.errTypes.revert,
                    "array can't be that big"
                )
            });

            it('should revert if add array is too big', async function (){
                let tooBigArray = new Array(51);
                await exceptions.expectThrow(
                    this.contract.linkToGroups(1, [1], tooBigArray.fill(5), { from: admin1 }),
                    exceptions.errTypes.revert,
                    "array can't be that big"
                )
            });

            it('should add a donator to groups', async function (){
                await this.contract.linkToGroups(1, [], [1, 3], { from: admin1 });
                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([true, false, true]);

                await this.contract.linkToGroups(1, [], [2], { from: admin1 });
                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([true, true, true]);

                await this.contract.linkToGroups(2, [], [2], { from: admin1 });
                result = await this.contract.areInGroups.call(2, [1, 2, 3]);
                expect(result).to.deep.equal([false, true, false]);
            });

            it('should revert if add to a group twice', async function (){
                await this.contract.linkToGroups(1, [], [2, 3], { from: admin1 });

                await exceptions.expectThrow(
                    this.contract.linkToGroups(1, [], [2], { from: admin1 }),
                    exceptions.errTypes.revert,
                    "this id should NOT exists in list"
                );
            });

            it('should revert if add to unexisting group', async function (){
                await exceptions.expectThrow(
                    this.contract.linkToGroups(1, [], [2, 4], { from: admin1 }),
                    exceptions.errTypes.revert,
                    "Can't assign to unexisting group"
                );
            });

            it('should emit DonatorAddedToGroups event', async function (){
                await events.inTransaction(
                    this.contract.linkToGroups(1, [], [1, 3], { from: admin1 }),
                    'DonatorAddedToGroups',
                    {
                        actor: admin1,
                        donatorId: new BN(1),
                        groupIds: [new BN(1), new BN(3)],
                    }
                );
            });
            it('should NOT emit DonatorRemovedFromGroups event', async function (){
                await events.notInTransaction(
                    this.contract.linkToGroups(1, [], [1, 3], { from: admin1 }),
                    'DonatorRemovedFromGroups'
                );
            });
        });

        context('remove a donator from groups', async function (){
            it('should remove a donator from groups', async function (){
                await this.contract.linkToGroups(1, [], [1, 2, 3], { from: admin1 });
                await this.contract.linkToGroups(2, [], [1, 2, 3], { from: admin1 });

                await this.contract.linkToGroups(1, [1, 3], [], { from: admin1 });
                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([false, true, false]);

                await this.contract.linkToGroups(2, [2], [], { from: admin1 });
                result = await this.contract.areInGroups.call(2, [1, 2, 3]);
                expect(result).to.deep.equal([true, false, true]);

                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([false, true, false]);
            });

            it('should emit DonatorRemovedFromGroups event', async function (){
                await this.contract.linkToGroups(1, [], [1, 2, 3], { from: admin1 });
                await this.contract.linkToGroups(2, [], [1, 2, 3], { from: admin1 });

                await events.inTransaction(
                    this.contract.linkToGroups(1, [1, 3], [], { from: admin1 }),
                    'DonatorRemovedFromGroups',
                    {
                        actor: admin1,
                        donatorId: new BN(1),
                        groupIds: [new BN(1), new BN(3)],
                    }
                );
            });

            it('should NOT emit DonatorAddedToGroups event', async function (){
                await this.contract.linkToGroups(1, [], [1, 2, 3], { from: admin1 });
                await this.contract.linkToGroups(2, [], [1, 2, 3], { from: admin1 });

                await events.notInTransaction(
                    this.contract.linkToGroups(1, [1, 3], [], { from: admin1 }),
                    'DonatorAddedToGroups'
                );
            });

            it('should revert if remove unexisting link', async function (){
                await this.contract.linkToGroups(1, [], [2, 3], { from: admin1 });

                await exceptions.expectThrow(
                    this.contract.linkToGroups(1, [1, 3], [], { from: admin1 }),
                    exceptions.errTypes.revert,
                    "this id should exists in list"
                );
            });

            it('should revert if remove unexisting group', async function (){
                await this.contract.linkToGroups(1, [], [2, 3], { from: admin1 });

                await exceptions.expectThrow(
                    this.contract.linkToGroups(1, [2, 4], [], { from: admin1 }),
                    exceptions.errTypes.revert,
                    "Can't unassign from unexisting group"
                );
            });
        });

        context('are a donator in groups', async function (){

            it('should revert if array is too big', async function (){
                let tooBigArray = new Array(51);
                await exceptions.expectThrow(
                    this.contract.areInGroups.call(1, tooBigArray.fill(5)),
                    exceptions.errTypes.revert,
                    "array can't be that big"
                )
            });

            it('should show correct status of donators', async function (){
                await this.contract.linkToGroups(1, [], [2, 3], { from: admin1 });
                await this.contract.linkToGroups(2, [], [1, 2], { from: admin1 });

                result = await this.contract.areInGroups.call(1, [1, 2, 3]);
                expect(result).to.deep.equal([false, true, true]);

                result = await this.contract.areInGroups.call(2, [1, 2, 3]);
                expect(result).to.deep.equal([true, true, false]);

            });
        });

        context('next donator in a group', async function (){
            it('should show next donator', async function (){
                await this.contract.linkToGroups(1, [], [2, 3], { from: admin1 });
                await this.contract.linkToGroups(2, [], [1, 2], { from: admin1 });
                await this.contract.linkToGroups(3, [], [1, 2, 3], { from: admin1 });

                result = await this.contract.nextGroupDonator.call(2, 0);
                assert.equal(result, 1);
                result = await this.contract.nextGroupDonator.call(2, 1);
                assert.equal(result, 2);
                result = await this.contract.nextGroupDonator.call(1, 0);
                assert.equal(result, 2);
                result = await this.contract.nextGroupDonator.call(1, 2);
                assert.equal(result, 3);
            });
        });

        context('move donator inside a group', async function (){
            beforeEach(async function (){
                await this.contract.linkToGroups(1, [], [1, 2, 3], { from: admin1 });
                await this.contract.linkToGroups(2, [], [1, 2, 3], { from: admin1 });
                await this.contract.linkToGroups(3, [], [1, 2, 3], { from: admin1 });
            });

            it("should revert if group doesn't exists", async function (){
                await exceptions.expectThrow(
                    this.contract.moveDonator(4, 1, 3, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "this id should exists in list"
                );
            });

            it("should revert if donator doesn't exists", async function (){
                await exceptions.expectThrow(
                    this.contract.moveDonator(1, 4, 3, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "this id should exists in list"
                );
            });

            it("should revert if position doesn't exists", async function (){
                await exceptions.expectThrow(
                    this.contract.moveDonator(1, 1, 4, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "this id should exists in list"
                );
            });

            it("should revert if id = target", async function (){
                await exceptions.expectThrow(
                    this.contract.moveDonator(1, 1, 1, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "id can't be equal target"
                );
            });

            it('should move donator', async function (){
                result = await this.contract.nextGroupDonator.call(1, 0);
                assert.equal(result, 1);
                result = await this.contract.nextGroupDonator.call(1, 1);
                assert.equal(result, 2);
                result = await this.contract.nextGroupDonator.call(1, 2);
                assert.equal(result, 3);

                result = await this.contract.moveDonator(1, 1, 2);

                result = await this.contract.nextGroupDonator.call(1, 0);
                assert.equal(result, 2);
                result = await this.contract.nextGroupDonator.call(1, 2);
                assert.equal(result, 1);
                result = await this.contract.nextGroupDonator.call(1, 1);
                assert.equal(result, 3);
            });

            it('should move first to last', async function (){
                await this.contract.moveDonator(1, 1, 3);
                result = await this.contract.nextGroupDonator.call(1, 2);
                assert.equal(result, 3);
                result = await this.contract.nextGroupDonator.call(1, 3);
                assert.equal(result, 1);
            });

            it('should move fisrt to middle', async function (){
                await this.contract.moveDonator(1, 1, 2);
                result = await this.contract.nextGroupDonator.call(1, 2);
                assert.equal(result, 1);
                result = await this.contract.nextGroupDonator.call(1, 1);
                assert.equal(result, 3);
            });

            it('should move last to first', async function (){
                await this.contract.moveDonator(1, 3, 0);
                result = await this.contract.nextGroupDonator.call(1, 0);
                assert.equal(result, 3);
                result = await this.contract.nextGroupDonator.call(1, 3);
                assert.equal(result, 1);
            });

            it('should move last to middle', async function (){
                result = await this.contract.moveDonator(1, 3, 1);
                result = await this.contract.nextGroupDonator.call(1, 1);
                assert.equal(result, 3);
                result = await this.contract.nextGroupDonator.call(1, 3);
                assert.equal(result, 2);
            });

            it('should move middle to middle', async function (){
                await this.contract.linkToGroups(4, [], [1, 2, 3], { from: admin1 });
                await this.contract.linkToGroups(5, [], [1, 2, 3], { from: admin1 });

                await this.contract.moveDonator(1, 2, 4);
                result = await this.contract.nextGroupDonator.call(1, 1);
                assert.equal(result, 3);
                result = await this.contract.nextGroupDonator.call(1, 3);
                assert.equal(result, 4);
                result = await this.contract.nextGroupDonator.call(1, 4);
                assert.equal(result, 2);
                result = await this.contract.nextGroupDonator.call(1, 2);
                assert.equal(result, 5);
            });

            it('should emit move donator in group event', async function (){
                await events.inTransaction(
                    this.contract.moveDonator(1, 1, 2, { from: admin1 }),
                    'DonatorMovedInGroup',
                    {
                        actor: admin1,
                        groupId: new BN(1),
                        donatorId: new BN(1),
                        to: new BN(2)
                    }
                );
            });
        });

        context('return donators id from a group', async function (){
            // it('should return array with 1000 ids', async function (){
            //     let expected = [];
            //     const size = 1000;
            //     for (var i=1; i<(size+10); i++){
            //         await this.contract.addToGroups(i, [1], { from: admin1 });
            //         if (i<=size) expected.push(i);
            //     }
            //     let result = await this.contract.getGroup.call(Donators(1, 0, size);
            //
            //     for (var i=0; i<result.length; i++){
            //         assert.equal(result[i], expected[i]);
            //     }
            // });

            it('should return array of ids and 0s', async function (){
                let expected = [];
                const actualSize = 10;
                const expectedSize = 20;
                for (var i=1; i<(actualSize); i++){
                    await this.contract.linkToGroups(i, [], [1], { from: admin1 });
                }
                for (var i=1; i<=expectedSize; i++){
                    if (i < actualSize) {
                        expected.push(i);
                    } else {
                        expected.push(0);
                    }
                }
                let result = await this.contract.getGroupDonators.call(1, 0, expectedSize);

                for (var i=0; i<result.length; i++){
                    assert.equal(result[i], expected[i]);
                }
            });

            it('should return array with 0 for empty result', async function (){
                let expected = [];
                const size = 10;
                for (var i=0; i<size; i++){
                    expected.push(0);
                }
                let result = await this.contract.getGroupDonators.call(1, 0, size);
                for (var i=0; i<result.length; i++){
                    assert.equal(result[i], expected[i]);
                }
            });

            it('should revert for unexisted group', async function (){
                await exceptions.expectThrow(
                    this.contract.getGroupDonators.call(22, 1, 2, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "group must exist"
                );
            });

            it('should revert for unexisted donator', async function (){
                await exceptions.expectThrow(
                    this.contract.getGroupDonators.call(1, 100, 2, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "this id should exists in list"
                );
            });

            it('should revert for 0 count', async function (){
                await exceptions.expectThrow(
                    this.contract.getGroupDonators.call(1, 0, 0, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "Count can't be 0"
                );
            });

            it('should revert if count more than 1000', async function (){
                await exceptions.expectThrow(
                    this.contract.getGroupDonators.call(1, 0, 1001, { from: admin1 }),
                    exceptions.errTypes.revert,
                    "List can't be more than 1000"
                );
            });
        });
    });
});
