import React, {Component} from 'react';
import DonatorListItem from "./DonatorListItem";

class DonatorList extends Component {

    render(){
        return (
            <div>
                {this.props.donators.map(donator =>
                    <DonatorListItem donator={donator} key={donator.id} />
                )}
            </div>
        )
    }
}

export default DonatorList;