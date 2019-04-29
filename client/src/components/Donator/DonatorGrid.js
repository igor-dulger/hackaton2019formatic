import React, {Component} from 'react';
import DonatorGridItem from "./DonatorGridItem";
import SortButton from "../General/SortButton";

class DonatorGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            donators: props.donators,
            pendings: props.pendings,
            remove: props.remove,
            currentSort: props.currentSort,
            currentDirection: props.currentDirection,
            onSortClick: props.onSortClick,
        }

        console.log("Grid pendings", props.pendings);
    }

    render(){
        return (
        <table className="pure-table pure-table-bordered pure-table-horizontal donators-grid">
            <thead>
            <tr>
                <th><SortButton label="ID" name="id" currentSort={this.state.currentSort} currentDirection={this.state.currentDirection} onClick={this.state.onSortClick} /></th>
                <th><SortButton label="First Name" name="firstName" currentSort={this.state.currentSort} currentDirection={this.state.currentDirection} onClick={this.state.onSortClick} /></th>
                <th><SortButton label="Last Name" name="lastName" currentSort={this.state.currentSort} currentDirection={this.state.currentDirection} onClick={this.state.onSortClick} /></th>
                <th>Country</th>
                <th>Groups</th>
                <th>Birthday</th>
                <th>Donated Date</th>
                <th><SortButton label="Created" name="createdDate" currentSort={this.state.currentSort} currentDirection={this.state.currentDirection} onClick={this.state.onSortClick} /></th>
                <th><SortButton label="Updated" name="updatedDate" currentSort={this.state.currentSort} currentDirection={this.state.currentDirection} onClick={this.state.onSortClick} /></th>
                <th>Identifier</th>
                <th>Blockchain Link</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                this.state.donators.map((donator, index) =>
                    <DonatorGridItem donator={donator} pending={this.state.pendings[index]} key={donator.id} remove={this.state.remove}/>
                )
            }
            </tbody>
        </table>

        )
    }
}

export default DonatorGrid;