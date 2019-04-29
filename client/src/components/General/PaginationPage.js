import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class PaginationPage extends Component {

    constructor(props) {
        super(props);

        console.log("this.props -> ", this.props);

        this.state = {
            page: props.page.page,
            label: props.page.label,
            currentPage: props.currentPage,
            onClickHandler: props.onClick
        }
    }

    render() {
        return (
            <span>
                {this.state.page === this.state.currentPage &&<li className="pure-menu-item pure-menu-disabled pure-button pure-button-disabled">{this.state.label}</li>}
                {this.state.label === "..." && <li className="pure-menu-item pure-menu-disabled">{this.state.label}</li>}
                {
                    (this.state.page !== this.state.currentPage && this.state.label !== "...") &&
                    <li className="pure-menu-item">
                        <Link to="#" className="pure-menu-link" onClick={this.state.onClickHandler}>{this.state.label}</Link>
                    </li>
                }
            </span>
        );
    }
}

export default PaginationPage;