import PendingService from "./PendingService";
import AppStorageService from "./AppStorageService";
import BlockchainService from "./BlockchainService";

class GroupService extends BlockchainService {

    newEntity() {
        return {
            id: 0,
            name: "",
            description: "",
            code: "",
            version: 0,
        }
    }

    newPendingEntity(entity, pendingMode) {
        //pendingMode - add, edit, delete
        return {...entity, pendingMode: pendingMode}
    }

    convertEntityToData(group) {
        let tempGroup = {...group};
        delete tempGroup['id'];
        delete tempGroup['version'];
        return tempGroup;
    }

    addGroupToBlockchain(group) {
        let tempGroup = this.convertEntityToData(group);
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.addGroup(JSON.stringify(tempGroup), tempGroup.code),
            {from: AppStorageService.currentAccount}
        );
    }

    updateGroupInBlockchain(group) {
        let tempGroup = this.convertEntityToData(group);
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.updateGroup(
                group.id,
                JSON.stringify(tempGroup, ["name", "description", "code"]),
                tempGroup.code
            ),
            {from: AppStorageService.currentAccount}
        );
    }

    removeGroupFromBlockchain(group) {
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.removeGroup(group.id),
            {from: AppStorageService.currentAccount}
        );
    }

    addGroup(group) {
        return this.addGroupToBlockchain(group).then(() => {
            return PendingService.add('add', 'group', group);
        })
    }

    updateGroup(group) {
        return this.updateGroupInBlockchain(group).then(() => {
            return PendingService.add('edit', 'group', group);
        })
    }

    removeGroup(group) {
        return this.removeGroupFromBlockchain(group).then(() => {
            return PendingService.add('delete', 'group', group);
        })
    }

    getGroups() {
        return fetch(AppStorageService.backendURL + '/api/groups')
            .then(response => response.json())
    }

    getGroup(id) {
        return fetch(AppStorageService.backendURL + '/api/group/' + id)
            .then(response => {
                return response.json()
            });
    }
}

export default new GroupService();