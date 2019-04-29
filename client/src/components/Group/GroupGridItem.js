import React, {Component} from 'react';
import PendingStatus from "../General/PendingStatus";
import { Link } from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import {withRouter} from "react-router-dom"
import GeneralService from "../../services/GeneralService";

class GroupGridItem extends Component {
    constructor(props) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(event) {
        event.preventDefault();
        this.props.remove(this.props.group).then(() => {
            NotificationManager.info('Please wait for confirmation.', '', 5000);
            this.props.history.push('/admin/pending/groups');
        }).catch(error => {
            console.log(GeneralService.getWeb3ErrorText(error.message));
            NotificationManager.error('Cannot delete group.', GeneralService.getWeb3ErrorText(error.message), 8000);
        });
        return true;
    }

    render() {
        return (
            <tr>
                <td>
                    {this.props.group.id}
                </td>
                <td>
                    {this.props.group.name}
                </td>
                <td>
                    {this.props.group.description}
                </td>
                <td>
                    {this.props.group.code}
                </td>
                <td>
                    {this.props.pending !== null &&  <PendingStatus pendingType={this.props.pending.body.type}/>}
                    {
                        this.props.pending === null && <div>
                            <Link to={"/admin/groups/edit/"+this.props.group.id} className="button-small button-success pure-button">Edit</Link>&nbsp;
                            <button className="button-small button-error pure-button" onClick={this.handleRemove}>Delete</button>
                        </div>
                    }
                </td>
            </tr>
        )
    }
}

export default withRouter(GroupGridItem);