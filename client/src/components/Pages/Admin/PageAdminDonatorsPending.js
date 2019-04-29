import React, {Component} from "react";
import {Link} from 'react-router-dom';
import Loading from "../../General/Loading";
import PendingService from "../../../services/PendingService";
import DonatorPendingGrid from "../../Donator/DonatorPendingGrid";

class PageAdminDonatorsPending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendings: [],
            loading: true
        };

        this.processedPendingsCallback = this.processedPendingsCallback.bind(this);
    }

    loadPendings() {
        PendingService.getDonatorPendings().then(pendings => {
            console.log("Pendings", pendings);
            this.setState({
                pendings: pendings,
                loading: false
            });
        })
    }

    processedPendingsCallback(processedPendings) {
        if (processedPendings.length > 0) {
            this.loadPendings();
        }
    }

    componentWillMount() {
        PendingService.subscribeCheckingPendings(this.processedPendingsCallback);
        this.loadPendings();
    }

    componentWillUnmount() {
        PendingService.unsubscribeCheckingPendings(this.processedPendingsCallback);
    }

    render() {
        return (
            <div>
                <h1>Donators</h1>
                <Loading loading={this.state.loading}/>

                {!this.state.loading && <div>
                    <div className="donator-menu">
                        <Link to='/admin/donators' className="pure-button">Active</Link>&nbsp;
                        <Link to='/admin/pending/donators' className="pure-button pure-button-disabled">Pending</Link>&nbsp;
                        <Link to='/admin/donators/add' className="pure-button">Add new donator</Link>&nbsp;
                    </div>

                    <DonatorPendingGrid pendings={this.state.pendings} />
                </div>
                }
            </div>
        );
    }
}

export default PageAdminDonatorsPending;