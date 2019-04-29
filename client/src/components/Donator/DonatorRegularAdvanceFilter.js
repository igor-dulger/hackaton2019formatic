import React, {Component} from 'react';
import Country from "../General/Country";

class DonatorRegularAdvanceFilter extends Component {
    constructor(props) {
        super(props)

        this.state = this.getEmptyFilters();

        this.onApplyFilterClick = props.onApplyFilterClick;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleClearFiltersClick = this.handleClearFiltersClick.bind(this);
    }

    getEmptyFilters() {
        return {
            searchQuery: '',
            firstName: '',
            lastName: '',
            country: '',
            donatedDateFrom: '',
            donatedDateTo: '',
            birthdayFrom: '',
            birthdayTo: '',
        }
    }

    handleClearFiltersClick(event) {
        event.preventDefault();
        this.setState(this.getEmptyFilters());
        return false;
    }

    handleFilterClick(event) {
        event.preventDefault();
        var state = {...this.state};
        var filtered = Object.keys(state).reduce(function (r, e) {
            if (state[e] !== "") r[e] = state[e];
            return r;
        }, {});

        this.onApplyFilterClick(filtered);
        return true;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        var state = {};
        state[name] = value;
        this.setState(state);
    }

    handleChange(value) {
        this.setState({
            groupId: value
        });
    }

    render() {
        return (
            <div className="pure-g">
                <div className='pure-u-1-1'>
                    <h2>Find donators</h2>
                    <form className="pure-form pure-form-stacked">
                        <fieldset>
                            <div className="pure-g">
                                <div className="pure-u-md-1-4">
                                    <label htmlFor="firstName">First name</label>
                                    <input name="firstName" type="text" placeholder="First name" className="pure-u-md-23-24"
                                           value={this.state.firstName} onChange={this.handleInputChange}/>
                                </div>
                                <div className="pure-u-md-1-4">
                                    <label htmlFor="lastName">Last name</label>
                                    <input name="lastName" type="text" placeholder="Last name" className="pure-u-md-23-24"
                                           value={this.state.lastName} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-2">
                                    <label htmlFor="country">Country</label>
                                    <Country placeholder="country" value={this.state.country} className="pure-u-md-23-24"
                                             onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-4">
                                    <label htmlFor="donatedDateFrom">Donated Date from</label>
                                    <input name="donatedDateFrom" type="date" placeholder="From Date" className="pure-u-md-23-24"
                                           value={this.state.donatedDateFrom} onChange={this.handleInputChange}/>
                                </div>


                                <div className="pure-u-md-1-4">
                                    <label htmlFor="donatedDateTo">Donated Date to</label>
                                    <input name="donatedDateTo" type="date" placeholder="Date" className="pure-u-md-23-24"
                                           value={this.state.donatedDateTo} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-4">
                                    <label htmlFor="birthdayFrom">Birthday from</label>
                                    <input name="birthdayFrom" type="date" placeholder="Date" className="pure-u-md-23-24"
                                           value={this.state.birthdayFrom} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-4">
                                    <label htmlFor="birthdayTo">Birthday to</label>
                                    <input name="birthdayTo" type="date" placeholder="Date" className="pure-u-md-23-24"
                                           value={this.state.birthdayTo} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-1">
                                    <button type="submit" className="button-success pure-button"
                                            onClick={this.handleFilterClick}>Apply Filters
                                    </button>
                                    &nbsp;&nbsp;
                                    <button className="button pure-button"
                                            onClick={this.handleClearFiltersClick }>Clear Filters
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default DonatorRegularAdvanceFilter;