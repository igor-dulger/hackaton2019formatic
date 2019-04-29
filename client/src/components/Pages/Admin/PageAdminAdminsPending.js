import React, {Component} from "react";
import { Link } from 'react-router-dom';
import Loading from "../../General/Loading";
import PendingService from "../../../services/PendingService";
import AdminPendingGrid from "../../Admin/AdminPendingGrid";

class PageAdminAdminsPending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendings: [],
            loading: true
        }
        this.processedPendingsCallback = this.processedPendingsCallback.bind(this);
    }

    loadPendings() {
        PendingService.getAdminPendings().then(pendings => {
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


    render(){
        return (
            <div>
                <h1>Pending Admins</h1>
                <Loading loading={this.state.loading} />
                { !this.state.loading && <div>
                    <div className="admin-menu">
                        <Link to='/admin/admins' className="pure-button">Active</Link>&nbsp;
                        <Link to='/admin/pending/admins' className="pure-button pure-button-disabled">Pending</Link>&nbsp;
                        <Link to='/admin/admins/add' className="pure-button">Add new admin</Link>
                    </div>
                    <AdminPendingGrid pendings={this.state.pendings} />
                </div>
                }
            </div>
        );
    }
}

export default PageAdminAdminsPending;