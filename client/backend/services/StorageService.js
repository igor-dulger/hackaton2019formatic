class StorageService {

    constructor (){
        this.web3 = null;
        this.hallOfFameContract = null;
        this.events = null;
    }

    set(key, value) {
        this[key] = value;
    }
}

module.exports = new StorageService();
