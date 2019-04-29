import React, {Component} from 'react';
import DonatorListItem from "./DonatorListItem";

class DonatorSimpleListItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            collapsed: true
        }
        this.switchHandle = this.switchHandle.bind(this);
    }

    switchHandle(event) {
        this.setState({
            collapsed: !this.state.collapsed
        });

        return false;
    }

    render() {
        return (
            <span className="donator-simple-list-item">
                {this.state.collapsed && <span className="name" onClick={this.switchHandle}>{this.props.donator.firstName+' '+this.props.donator.lastName}</span>}
                {!this.state.collapsed && <div className="donator-simple-list-item-collapse"><span className="collapse" onClick={this.switchHandle}>- Collapse</span></div>}
                {!this.state.collapsed && <DonatorListItem donator={this.props.donator}/>}
            </span>
        )
    }
}

export default DonatorSimpleListItem;