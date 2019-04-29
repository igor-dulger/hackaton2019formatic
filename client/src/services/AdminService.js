import PendingService from "./PendingService";
import AppStorageService from "./AppStorageService";
import BlockchainService from "./BlockchainService";

class AdminService extends BlockchainService {

    newEntity() {
        return {
            id: 0,
            nickname: "",
            address: "",
            version: 0,
        }
    }

    newPendingEntity(entity, pendingMode) {
        //pendingMode - add, edit, delete
        return {...entity, pendingMode: pendingMode}
    }

    convertEntityToData(admin) {
        let tempAdmin = {...admin};
        delete tempAdmin['id'];
        delete tempAdmin['version'];
        return tempAdmin;
    }

    isOwner() {
        return AppStorageService.hallOfFameContract.methods.isOwner().call({from: AppStorageService.currentAccount});
    }

    addAdminToBlockchain(admin) {
        let tempAdmin = this.convertEntityToData(admin);
        return this.sendToBlockchain(
                AppStorageService.hallOfFameContract.methods.addAdmin(JSON.stringify(tempAdmin), tempAdmin.address),
                {from: AppStorageService.currentAccount}
            );
    }

    updateAdminInBlockchain(admin) {
        let tempAdmin = this.convertEntityToData(admin);
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.updateAdmin(
                admin.id,
                JSON.stringify(tempAdmin, ["nickname", "address"]),
                tempAdmin.address
            ),
            {from: AppStorageService.currentAccount}
        );
    }

    removeAdminFromBlockchain(admin) {
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.removeAdmin(admin.id),
            {from: AppStorageService.currentAccount}
        );
    }

    addAdmin(admin) {
        return this.addAdminToBlockchain(admin).then(() => {
            return PendingService.add('add', 'admin', admin);
        })
    }

    updateAdmin(admin) {
        return this.updateAdminInBlockchain(admin).then(() => {
            return PendingService.add('edit', 'admin', admin);
        })
    }

    removeAdmin(admin) {
        return this.removeAdminFromBlockchain(admin).then(() => {
            return PendingService.add('delete', 'admin', admin);
        })
    }

    getAdmins() {
        return fetch(AppStorageService.backendURL + '/api/admins')
            .then(response => response.json())
    }

    getAdmin(id) {
        return fetch(AppStorageService.backendURL + '/api/admin/' + id)
            .then(response => {
                return response.json()
            });
    }

}

export default new AdminService();