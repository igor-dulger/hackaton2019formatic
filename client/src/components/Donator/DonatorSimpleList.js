import React, {Component} from 'react';
import DonatorSimpleListItem from "./DonatorSimpleListItem";

class DonatorSimpleList extends Component {

    render(){
        return (
            <div>
                {this.props.donators.map(donator =>
                    <DonatorSimpleListItem donator={donator} key={donator.id} />
                )}
            </div>
        )
    }
}

export default DonatorSimpleList;