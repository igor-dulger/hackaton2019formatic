const configService = require('../services/ConfigService');
configService.loadWeb3(require('../../../truffle.js'));

const Web3 = require('web3');
const hallOfFame = require('../../src/contracts/HallOfFame.json');
var web3js;
var contract;
console.log(configService.syncServer.websocketProvider);
function getWeb3() {
    web3js = new Web3(new Web3.providers.WebsocketProvider(configService.syncServer.websocketProvider));
    return web3js.eth.net.getId().then((networkId) => {
        const abi = hallOfFame.abi;
        const address = hallOfFame.networks[networkId].address;
        contract = new web3js.eth.Contract(abi, address);
    });
}

getWeb3().then(() => {
    web3js.eth.getAccounts().then((accounts) => {
        var from = accounts[0];
        var gas = 1000000;
        return seedData(accounts[0], 1000000);
    })
    .then(() => {
        console.log("Seeding has been finished.");
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });
})

async function seedData(from, gas){
    groupsCount = 4;
    donatorsCount = 50;
    await seedAdmins([from], from, gas);
    await seedGroups(from, gas);
    await seedDonators(donatorsCount, from, gas);
    await seedGroupDonatorRelations(groupsCount, donatorsCount, from, gas);
    return true;
}

async function seedAdmins(addresses, from, gas) {
    for (var i=0; i<addresses.length; i++){
        await contract.methods.addAdmin(JSON.stringify({nickname: "Admin"+i}), addresses[i]).send({from: from, "gas": gas})
        console.log("Admin", i, "seeded");
    }
    console.log("seedAdmins has been finished.")
}

async function seedGroups(from, gas) {
    var groups = [
        {
            name: "Top",
            description: "Top donators",
            code: "top",
        },
        {
            name: "Gold",
            description: "Gold donators",
            code: "gold",
        },
        {
            name: "Silver",
            description: "Silver donators",
            code: "silver",
        },
        {
            name: "Bronze",
            description: "Bronze donators",
            code: "bronze",
        },
    ];
    for (var i=0; i<groups.length; i++){
        var data = JSON.stringify({
                    name: groups[i].name,
                    description: groups[i].description,
            });
        await contract.methods.addGroup(data, groups[i].code).send({from: from, "gas": gas})
        console.log("Group", groups[i].name, "seeded");
    }
    console.log("seedGroups has been finished.")
}

function getRandomImage() {
    var pool = [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzh58GZA0hSKo2SEkCZwQLsIHFGDmfVqzeK1StTh3jERkptp-v",
        "https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://www.menshealth.de/media/mh-265632/1920x/shgrauehaare1121116859800x462jpg.jpg?source=default",
        "https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "http://pluspng.com/img-png/png-hd-man-business-man-businessman-hd-png-693.png",
        "https://www.menshairstylestoday.com/wp-content/uploads/2017/05/Man-Bun-Undercut-with-Beard.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnpPYs70g_PfQRDPZwdQKMJq29_BZOOBdYp62NZyBuD3BgAdgd",
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://static01.nyt.com/images/2018/09/27/us/27Swetnick-print/27Swetnick1-articleLarge-v3.jpg?quality=75&auto=webp&disable=upscale",
        "https://www.lifevinefamily.com/bin/uploads/2016/12/woman.jpg",
        "https://www.campaignlifecoalition.com/shared/media/editor/image/Marie-Claire_Bissonnette_645_410_75.jpg",
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://wisetoast.com/wp-content/uploads/2015/10/Katherine-Elizabeth-Upton-most-beautiful-woman.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe2BsJsvC5qNC8iW-rRRHAVzS3xhirkJizjf1jvr-uhE6LODkL",
        "",
        "",
        "",
        "",
    ];
    return pool[Math.floor(Math.random()*pool.length)];
}
async function seedDonators(donators, from, gas) {
    var fNames = 'Doug Nellie Lara Hong Narcisa Alessandra Mario September Micheline Porter Rosario Whitne Hettie Krystle Gwyneth Martina Edmond Randee Romana Annamaria Herman Tyson Kena Kerstin Eliseo Cristin Nida Jolanda Mitch Signe Denisha Nicholas Estefana Ludivina'.split(' ');
    var lNames ='Dumlao Tuten Hornbuckle Klima Bruce Wiste Harrigan Bitter Rogalski Cleavenger Nickle Carew Stow Rausch Aston Schupp Peachey Farrier Bissell Natal'.split(' ');

    for (var i=0; i<donators; i++){
        var d = new Date();
        var data = JSON.stringify({
                    firstName: fNames[i % fNames.length],
                    lastName: lNames[i % lNames.length],
                    country: "USA",
                    birthday: Math.round(d.getTime() / 1000),
                    donatedDate: Math.round(d.getTime() / 1000),
                    identifier: i,
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    image: getRandomImage(),
                    facebook: (i % 2 === 0) ? "http://facebook.com": "",
                    linkedin: (i % 3 === 0) ? "http://linkedin.com" : "",
                    twitter: (i % 4 === 0) ? "http://twitter.com" : "",
            });
        await contract.methods.addDonator(data, "donatorId_"+i).send({from: from, "gas": gas})
        console.log("Donator", i, "seeded");
    }
    console.log("seedDonators has been finished.")
}

async function seedGroupDonatorRelations(groups, donators, from, gas) {
    var groupList = [];

    function seedList(groupsCount){
        var groupList = [];
        for (var i=1; i<=groupsCount; i++){
            groupList.push(i)
        }
        return groupList
    }

    for (var i=1; i<=donators; i++){
        if (groupList.length == 0){
            groupList = seedList(groups);
        }
        await contract.methods.linkToGroups(i, [], [groupList.shift()]).send({from: from, "gas": gas})
        console.log("Relations for donator", i, "seeded");
    }
    console.log("seedGroupDonatorRelations has been finished.")
}
