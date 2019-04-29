class ConfigService {

    constructor (){
        this.allowedEnvs = ["development", "rinkeby", "live"];
        this.syncServer = {
                port: 3000
        };
        this.web3 = {};
        this.db = {};
    }

    getEnv() {
        let env = process.argv[2] != undefined ? process.argv[2] : 'development';
        if (this.allowedEnvs.indexOf(env) == -1) {
            console.error("Invalid environment [", env, "] allowed list is", this.allowedEnvs);
            process.exit();
        }
        return env;
    }

    loadWeb3(config) {
        let env = this.getEnv();
        this.web3 = config.networks[env];
        this.syncServer = config.networks[env].syncServer;
    }

    loadDB(config) {
        let env = this.getEnv();
        this.db = config[env];
    }
}

module.exports = new ConfigService();
