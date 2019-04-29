import React, {Component} from 'react';
import GroupGridItem from "./GroupGridItem";

class GroupGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: props.groups,
            pendings: props.pendings,
            remove: props.remove,
        };
        console.log("Grid pendings", props.pendings);
    }

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
                    this.state.groups.map((group, index) =>
                        <GroupGridItem group={group} pending={this.state.pendings[index]} key={group.id} remove={this.state.remove}/>
                    )
                }
                </tbody>
            </table>
        )
    }
}

export default GroupGrid;