import AppStorageService from "./AppStorageService";
import AdminService from "./AdminService";

class GeneralService {

    getWeb3ErrorText(error) {
        var result = '';
        var pos = error.indexOf('} ');
        if (pos >= 0){
            result = error.substr(pos+2, error.length - pos+1);
        }
        return result;
    }

    getCurrentAccount() {
        return new Promise((resolve, reject) => {
            AppStorageService.web3.eth.getAccounts((error, accounts) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(accounts[0]);
            })
        });
    }

    getRoles() {
        return Promise.all([
            AdminService.getAdmins(),
            AdminService.isOwner()
        ]).then(results => {
            let admins = results[0];
            let isOwner = results[1];

            let found = admins.filter(admin => admin.address === AppStorageService.currentAccount);
            return {isAdmin: found.length > 0, isOwner: isOwner};

        }).catch(error => {
            return {isAdmin: false, isOwner: false};
        })
    }

}

export default new GeneralService();