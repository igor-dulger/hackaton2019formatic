import LocalStorageService from "./LocalStorageService";
import AppStorageService from "./AppStorageService";

class PendingService {

    constructor () {
        this.checkPendingsIntervalId = 0;
        this.checkPendingsCallbacks = [];
    }

    getIdentifier(type, entityType, entityData) {
        if (type === 'edit'  || type === 'delete') {
            return entityData.id
        } else {
            switch (entityType) {
                case 'group' : return entityData.code;
                case 'admin' : return entityData.address;
                case 'donator' : return entityData.identifier;
                default : return undefined;
            }
        }
    }

    newEntity(type, entityType, entityData) {
        return {
            body: {
                type: type,
                entityType: entityType,
                identifier: this.getIdentifier(type, entityType, entityData),
                version: entityData.version || 0,
            },
            data: entityData
        }
    }

    add(type,  entityType, entityData) {
        var entity = this.newEntity(type,  entityType, entityData);
        LocalStorageService.addPending(entity);
    }

    getAllPendings() {
        return LocalStorageService.loadPendings();
    }

    getPendingsByEntityType(entityType) {
        return new Promise(((resolve, reject) => {
            var allPendings = this.getAllPendings();
            resolve(allPendings.filter((pending) => {
                return pending.body.entityType === entityType;
            }));
        }));
    }

    getGroupPendings() {
        return this.getPendingsByEntityType('group');
    }

    getAdminPendings() {
        return this.getPendingsByEntityType('admin');
    }

    getDonatorPendings() {
        return this.getPendingsByEntityType('donator');
    }

    findPending(entityType, entityData, pendingList) {
        let result = null;

        for (var i=0; i<pendingList.length; i++){
            if (
                (pendingList[i].body.entityType === entityType) &&
                (this.getIdentifier(pendingList[i].body.type, entityType, entityData) === pendingList[i].body.identifier)
            ) {
                result = pendingList[i];
            }
        }
        return result;
    }

    findPendings(entityType, entityList, pendingList) {
        let results = [];
        for (var i=0; i<entityList.length; i++) {
            results.push(this.findPending(entityType, entityList[i], pendingList));
        }
        return results;
    }

    checkPendings(pendingList) {
        console.log('checkPendings = ', pendingList);

        return fetch(AppStorageService.backendURL+'/api/pendings', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(pendingList)
        }).then(response => response.json());
    }

    generateSuccessNotification(pending) {
        var action = "";
        if (pending.body.type === "add") {action = "added"}
        if (pending.body.type === "edit") {action = "updated"}
        if (pending.body.type === "delete") {action = "deleted"}

        var entityName = "";
        if (pending.body.entityType === "admin") {entityName = "Admin"}
        if (pending.body.entityType === "group") {entityName = "Group"}
        if (pending.body.entityType === "donator") {entityName = "Donator"}

        var name = ""
        if (pending.body.entityType === "admin") {name = pending.data.nickname}
        if (pending.body.entityType === "group") {name = pending.data.name}
        if (pending.body.entityType === "donator") {name = pending.data.firstName+" "+pending.data.lastName}


        if ((entityName !== "") && (action !== "") && (name !== "")) {
            return  entityName+"'"+name+"' has been "+action;
        } else {
            return "";
        }
    }

    processPendings(pendings) {
        var removeList = [];
        var processed = [];
        var messageType = 'success'; //or 'warning'
        for (var i=0; i<pendings.length; i++) {
            if (pendings[i].completed) {
                var message = this.generateSuccessNotification(pendings[i].pending);
                if (message !== "") {
                    messageType = 'success';
                } else {
                    message = "Unknown pending : type - '"+pendings[i].pending.body.type+"', entity - '"+pendings[i].pending.body.entityType+"'!";
                    messageType = 'warning';
                }

                processed.push({
                    pending: pendings[i].pending,
                    message: message,
                    messageType: messageType,
                });
                removeList.push(pendings[i].pending);
            }
        }

        this.removePendings(removeList);
        return processed;
    }

    startCheckingPendings() {
        this.checkPendingsIntervalId = setInterval(() => {
            var pendings = this.getAllPendings();
            if (pendings.length > 0) {
                this.checkPendings(pendings).then(result => {
                    var processed = this.processPendings(result);
                    console.log("checkPendings result: ", result);
                    console.log("processed : ", processed);
                    console.log("Subscribe callbacks: ", this.checkPendingsCallbacks);
                    this.checkPendingsCallbacks.forEach(callback => {
                        callback(processed);
                    });
                });
            }
        }, 15000);
    }

    stopCheckingPendings() {
        clearInterval(this.checkPendingsIntervalId);
        this.checkPendingsCallbacks = [];
    }

    subscribeCheckingPendings(callback) {
        return this.checkPendingsCallbacks.push(callback);
    }

    unsubscribeCheckingPendings(callback) {
        this.checkPendingsCallbacks.splice(this.checkPendingsCallbacks.indexOf(callback), 1);
    }

    isEqual(pending1, pending2) {
        return (pending1.body.type === pending2.body.type) &&
            (pending1.body.entityType === pending2.body.entityType) &&
            (pending1.body.identifier === pending2.body.identifier) &&
            (pending1.body.version === pending2.body.version);
    }

    removePendings(pendingList) {
        var results = [];
        var found = false;
        var allPendings = this.getAllPendings();
        for (var i=0; i<allPendings.length; i++) {
            found = false;
            for (var j=0; j<pendingList.length; j++) {
                if (this.isEqual(allPendings[i], pendingList[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                results.push(allPendings[i]);
            }
        }
        LocalStorageService.savePendings(results);

    }
}

export default new PendingService();