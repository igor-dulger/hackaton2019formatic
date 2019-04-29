import React, {Component} from 'react';
import DonatorGridItem from "./DonatorGridItem";

class DonatorPendingGrid extends Component {

    render() {
        return (
            <table className="pure-table pure-table-bordered pure-table-horizontal">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Country</th>
                    <th>Groups</th>
                    <th>Birthday</th>
                    <th>Donated Date</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Identifier</th>
                    <th>Blockchain Link</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.pendings.map(pending =>
                        <DonatorGridItem donator={pending.data} key={pending.body.identifier} pending={pending}/>
                    )
                }
                </tbody>
            </table>
        )
    }
}

export default DonatorPendingGrid;