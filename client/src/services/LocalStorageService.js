function setLocalStorageObjectItem(key, value) {
    if (value === undefined) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

function getLocalStorageObjectItem(key) {
    var json = localStorage.getItem(key);
    if (json === undefined) {
        return undefined;
    }
    return JSON.parse(json);
}


class LocalStorageService {
    getPendingsKey() {
        return "sdxcvbnfgh213";
    }

    loadPendings() {
        var pendings = getLocalStorageObjectItem(this.getPendingsKey());
        return  (pendings !== undefined) && (pendings !== null) ? pendings : [];
    }

    savePendings(pendings) {
        setLocalStorageObjectItem(this.getPendingsKey(), pendings)
    }

    addPending(pendingEntity) {
        var allPendings = this.loadPendings();
        allPendings.push(pendingEntity);
        this.savePendings(allPendings);
    }
}

export default new LocalStorageService();