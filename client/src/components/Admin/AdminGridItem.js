import React, {Component} from 'react';
import PendingStatus from "../General/PendingStatus";
import { Link } from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import {withRouter} from "react-router-dom"
import GeneralService from "../../services/GeneralService";

class AdminGridItem extends Component {
    constructor(props) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(event) {
        event.preventDefault();
        this.props.remove(this.props.admin).then(() => {
            NotificationManager.info('Please wait for confirmation.', '', 5000);
            this.props.history.push('/admin/pending/admins');
        }).catch(error => {
            console.log(GeneralService.getWeb3ErrorText(error.message));
            NotificationManager.error('Cannot delete admin.', GeneralService.getWeb3ErrorText(error.message), 8000);
        });
        return true;
    }

    render() {
        return (
            <tr key={this.props.admin.id}>
                <td>
                    {this.props.admin.id}
                </td>
                <td>
                    {this.props.admin.nickname}
                </td>
                <td>
                    {this.props.admin.address}
                </td>
                <td>
                    {this.props.pending !== null &&  <PendingStatus pendingType={this.props.pending.body.type}/>}
                    {
                        this.props.pending === null && <div>
                        <Link to={"/admin/admins/edit/"+this.props.admin.id} className="button-small button-success pure-button">Edit</Link>&nbsp;
                            <button className="button-small button-error pure-button" onClick={this.handleRemove}>Delete</button>
                        </div>
                    }
                </td>
            </tr>
        )
    }
}

export default withRouter(AdminGridItem);