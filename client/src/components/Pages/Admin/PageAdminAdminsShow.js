import React, {Component} from "react";
import {Link} from 'react-router-dom';
import AdminGrid from "../../Admin/AdminGrid";
import Loading from "../../General/Loading";
import AdminService from "../../../services/AdminService";
import PendingService from "../../../services/PendingService";

class PageAdminAdminsShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admins: [],
            pendings: [],
            error: "",
            loading: true
        }
    }

    componentWillMount() {
        AdminService.getAdmins().then(admins => {
            PendingService.getAdminPendings().then((pendings) => {
                var hasPendings = PendingService.findPendings('admin', admins, pendings);
                console.log("pendings :", pendings);
                console.log("hasPendings :", hasPendings);

                this.setState({
                    admins: admins,
                    pendings: hasPendings,
                    error: "",
                    loading: false
                });
            });
        }).catch(error => {
            this.setState({
                admins: [],
                pendings: [],
                error: 'Error: Cannot load admins. Try to refresh this page.',
                loading: false
            });
        });
    }

    render() {
        return (
            <div>
                <h1>Admins</h1>
                <Loading loading={this.state.loading}/>

                {!this.state.loading && <div>
                    <div className="admin-menu">
                        <Link to='/admin/admins' className="pure-button pure-button-disabled">Active</Link>&nbsp;
                        <Link to='/admin/pending/admins' className="pure-button">Pending</Link>&nbsp;
                        <Link to='/admin/admins/add' className="pure-button">Add new admin</Link>
                    </div>
                    {this.state.error === "" && <div className="total-count">Total: {this.state.admins.length} admin(s)</div>}
                    {this.state.error === "" && <AdminGrid admins={this.state.admins} pendings={this.state.pendings} remove={AdminService.removeAdmin.bind(AdminService)}/>}
                    {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
                </div>
                }
            </div>
        );
    }
}

export default PageAdminAdminsShow;