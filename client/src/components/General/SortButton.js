import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SortButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            label: props.label,
            name: props.name,
            currentSort: props.currentSort,
            currentDirection: props.currentDirection,
            onClickHandler: props.onClick
        }

        this.handleSortClick = this.handleSortClick.bind(this);
    }

    handleSortClick(event) {
        this.state.onClickHandler(this.state.name);
    }

    render() {
        return (
            <span>
                <Link to="#" onClick={this.handleSortClick}>{this.state.label}</Link>&nbsp;
                {(this.state.name === this.state.currentSort && this.state.currentDirection === 'asc' ) && <span className="sort-by-asc"></span> }
                {(this.state.name === this.state.currentSort && this.state.currentDirection === 'desc' ) && <span className="sort-by-desc"></span> }
            </span>
        );
    }
}

export default SortButton;