import React, {Component} from 'react';
import AdminGridItem from "./AdminGridItem";

class AdminGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admins: props.admins,
            pendings: props.pendings,
            remove: props.remove,
        }
        console.log("Grid pendings", props.pendings);
    }

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
                    this.state.admins.map((admin, index) =>
                        <AdminGridItem admin={admin} pending={this.state.pendings[index]} key={admin.id} remove={this.state.remove}/>
                    )
                }
                </tbody>
            </table>
        )
    }
}

export default AdminGrid;