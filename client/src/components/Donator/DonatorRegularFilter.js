import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {withRouter} from "react-router-dom"

class DonatorRegularFilter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: ""
        };

        this.onApplyFilterClick = props.onApplyFilterClick;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleFilterClearClick = this.handleFilterClearClick.bind(this);
    }

    handleFilterClick(event) {
        event.preventDefault();

        this.onApplyFilterClick(this.state.text);
        return true;
    }

    handleFilterClearClick(event) {
        event.preventDefault();

        this.setState({text: ""});
        this.onApplyFilterClick('');
        return false;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        var state = {};
        state[name] = value;
        this.setState(state);
    }

    render() {
        return (
            <div className="pure-g donator-regular-filter">
                <div className='pure-u-1-1'>
                    <form className="pure-form">
                        <fieldset>
                            <input className="pure-u-3-5 button-small " name="text" type="text" placeholder="First name or Last name" value={this.state.text} onChange={this.handleInputChange} />&nbsp;
                            <button type="submit" className="button-success pure-button" onClick={this.handleFilterClick}>GO</button>&nbsp;
                            { this.state.text !== "" && <span><button type="submit" className="pure-button" onClick={this.handleFilterClearClick}>Clear</button>&nbsp;</span> }
                            <Link to="/advsearch"><button className="button-secondary pure-button">Advanced Search</button></Link>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(DonatorRegularFilter);