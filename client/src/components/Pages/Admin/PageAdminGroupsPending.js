import React, {Component} from "react";
import {Link} from 'react-router-dom';
import Loading from "../../General/Loading";
import PendingService from "../../../services/PendingService";
import GroupPendingGrid from "../../Group/GroupPendingGrid";

class PageAdminGroupsPending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendings: [],
            loading: true
        }
        this.processedPendingsCallback = this.processedPendingsCallback.bind(this);
    }

    loadPendings() {
        PendingService.getGroupPendings().then(pendings => {
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
                <h1>Groups</h1>
                <Loading loading={this.state.loading}/>

                {!this.state.loading && <div>
                    <div className="group-menu">
                        <Link to='/admin/groups' className="pure-button">Active</Link>&nbsp;
                        <Link to='/admin/pending/groups' className="pure-button pure-button-disabled">Pending</Link>&nbsp;
                        <Link to='/admin/groups/add' className="pure-button">Add new group</Link>&nbsp;
                    </div>
                    <GroupPendingGrid pendings={this.state.pendings} />
                </div>
                }
            </div>
        );
    }
}

export default PageAdminGroupsPending;