import React, {Component} from 'react';
import PendingStatus from "../General/PendingStatus";
import { Link } from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import {withRouter} from "react-router-dom"
import GeneralService from "../../services/GeneralService";

class DonatorGridItem extends Component {
    constructor(props) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(event) {
        event.preventDefault();
        this.props.remove(this.props.donator).then(() => {
            NotificationManager.info('Please wait for confirmation.', '', 5000);
            this.props.history.push('/admin/pending/donators');
        }).catch(error => {
            console.log(GeneralService.getWeb3ErrorText(error.message));
            NotificationManager.error('Cannot delete donator.', GeneralService.getWeb3ErrorText(error.message), 8000);
        });
        return true;
    }

    render() {
        return (
            <tr key={this.props.donator.id}>
                <td>
                    {this.props.donator.id}
                </td>
                <td>
                    {this.props.donator.firstName}
                </td>
                <td>
                    {this.props.donator.lastName}
                </td>
                <td>
                    {this.props.donator.country}
                </td>
                <td>
                    {this.props.donator.groupsName.join(', ')}
                </td>
                <td>
                    {this.props.donator.birthday}
                </td>
                <td>
                    {this.props.donator.donatedDate}
                </td>
                <td>
                    {this.props.donator.createdDate}
                </td>
                <td>
                    {this.props.donator.updatedDate}
                </td>
                <td>
                    {this.props.donator.identifier}
                </td>
                <td>
                    <a href={"https://etherscan.io/tx/"+this.props.donator.createdTxHash} title={this.props.donator.createdTxHash}>{this.props.donator.createdTxHash.slice(0, 14) + '...'}</a>
                </td>
                <td>
                    {this.props.pending !== null &&  <PendingStatus pendingType={this.props.pending.body.type}/>}
                    {
                        this.props.pending === null && <div>
                            <Link to={"/admin/donators/edit/"+this.props.donator.id} className="button-small button-success pure-button">Edit</Link>&nbsp;
                            <button className="button-small button-error pure-button" onClick={this.handleRemove}>Delete</button>
                        </div>
                    }
                </td>
            </tr>
        )
    }
}

export default withRouter(DonatorGridItem);