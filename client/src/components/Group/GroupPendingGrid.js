import React, {Component} from 'react';
import GroupGridItem from "./GroupGridItem";

class GroupPendingGrid extends Component {

    render() {
        return (
            <table className="pure-table pure-table-bordered pure-table-horizontal">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Code</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.pendings.map(pending =>
                        <GroupGridItem group={pending.data} key={pending.body.identifier} pending={pending}/>
                    )
                }
                </tbody>
            </table>
        )
    }
}

export default GroupPendingGrid;