import React, {Component} from 'react';
import AdminGridItem from "./AdminGridItem";

class AdminPendingGrid extends Component {

    render() {
        return (
            <table className="pure-table pure-table-bordered pure-table-horizontal">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nickname</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.pendings.map(pending =>
                        <AdminGridItem admin={pending.data} key={pending.body.identifier} pending={pending}/>
                    )
                }
                </tbody>
            </table>
        )
    }
}

export default AdminPendingGrid;