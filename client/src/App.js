import React, {Component} from "react";
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'

import HallOfFameContract from "./contracts/HallOfFame.json";
import getWeb3 from "./utils/getWeb3";

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import "./App.css";
import 'react-notifications/lib/notifications.css';
import 'antd/dist/antd.css';

import PageEmpty from "./components/Pages/PageEmpty";
import Menu from "./components/Layout/Menu";
import AppStorageService from "./services/AppStorageService";
import {NotificationContainer} from 'react-notifications';
import PageAdminAdminIndex from "./components/Pages/Admin/PageAdminIndex";
import PageGeneralIndex from "./components/Pages/General/PageGeneralIndex";
import PageGeneralSearchDonator from "./components/Pages/General/PageGeneralSearchDonator";
import GeneralService from "./services/GeneralService";

class App extends Component {
    state = {
        storageValue: 0,
        web3: null,
        account: null,
        contract: null,
        roles: {isAdmin: false, isOwner: false},
        isReady: false,
        isError: false,
        errorMessage: ''
    };

    displayErrors(errorMessage) {
        this.setState({
            isError: true,
            isReady: true,
            errorMessage: errorMessage
        });
    }


    initWeb3() {
        return getWeb3().then(web3 => {
            AppStorageService.set('web3', web3);
            return web3;
        }).catch(() => {
            this.displayErrors('Error finding web3.');
        })
    }

    InspectAccountChange() {
        // this.changeAccountIntervalId = setInterval(() => {
        //     GeneralService.getCurrentAccount().then((newAccount) => {
        //         if ((newAccount !== this.state.account) && (this.state.account)) {
        //             window.location.reload();
        //         }
        //     });
        // }, 1000);
    }

    initApplication() {
        if (process.env.REACT_APP_ENV == 'production'){
            AppStorageService.set('backendURL', process.env.REACT_APP_BACKEND_URL_PRODUCTION);
        } else {
            AppStorageService.set('backendURL', process.env.REACT_APP_BACKEND_URL_LOCAL);
        }
        return this.initWeb3().then(web3 => {
            console.log("2web3", web3);
            return web3.eth.net.getId().then(networkId => {
                const deployedNetwork = HallOfFameContract.networks[networkId];
                if (deployedNetwork === undefined) {
                    return Promise.reject("Ca't find the contract in this network");
                }
                const instance = new web3.eth.Contract(
                    HallOfFameContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );

                GeneralService.getCurrentAccount().then(account => {
                    AppStorageService.set('hallOfFameContract', instance);
                    AppStorageService.set('currentAccount', account);

                    GeneralService.getRoles().then(roles => {
                        this.setState({isReady: true, web3: web3, account: account, contract: instance, roles: roles });
                    });
                });
            });

        }).catch(e => {
            console.log('NO Web3. User mode on.');
            this.setState({isReady: true, web3: null, account: null, contract: null, roles: {isAdmin: false, isOwner: false}});
        });
    }

    componentWillUnmount() {
        clearInterval(this.changeAccountIntervalId);
    }


    componentDidMount() {
        this.initApplication().then(() => {
            this.InspectAccountChange();
        }).catch(error => {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        });
    };

    render() {
        if (!this.state.isReady) {
            return <div>Loading...</div>;
        }
        return (
            <div className="general-container">
                <div className="App">
                    <Router>
                        <main className="container">
                            <Menu roles={this.state.roles} account={this.state.account}/>
                            <div className='sub-container'>
                                <Switch>
                                    <Route path='/' exact render={(props) => (
                                        <PageGeneralIndex/>
                                    )}/>

                                    <Route path='/advsearch' exact render={(props) => (
                                        <PageGeneralSearchDonator/>
                                    )}/>

                                    {(this.state.roles.isAdmin || this.state.roles.isOwner )&&
                                    <Route path='/admin' component={PageAdminAdminIndex}/>}


                                    <Route render={(props) => (
                                        <PageEmpty text="Error: 404. Page not found."/>
                                    )}/>
                                </Switch>
                            </div>
                        </main>
                    </Router>
                    <NotificationContainer/>
                </div>
            </div>
        );
    }
}

export default App;
