import React, {Component} from 'react';
import DonatorService from "../../../services/DonatorService";
import DonatorList from "../../Donator/DonatorList";
import Loading from "../../General/Loading";
import DonatorRegularAdvanceFilter from "../../Donator/DonatorRegularAdvanceFilter";
import Pagination from "../../General/Pagination";
import NoResultsFound from "../../General/NoResultsFound";
import SearchResults from "../../General/SearchResults";

class PageGeneralSearchDonator extends Component {

    constructor(props) {
        super(props);

        this.order = {
            field: "id",
            direction: "asc"
        };
        this.currentPage = 1;
        this.filters = {};

        this.state = {
            donators: [],
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: 10,
                rowCount: 1
            },
            loading: true,
            error: "",
        }
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
        this.handleApplyFilterClick = this.handleApplyFilterClick.bind(this);
    }

    handleApplyFilterClick(filters) {
        console.log("FILTERS: ", filters);
        this.filters = {...filters};
        this.reLoadDonators();
    }

    handlePaginationClick(page) {
        this.currentPage = page;
        this.reLoadDonators();
    }

    reLoadDonators() {
        this.setState({
            loading: true,
        });
        this.loadDonators();
    }

    loadDonators() {
        var params = {
            ...this.filters,
            order: {
                field: 'id',
                direction: 'desc'
            },
            page: this.currentPage
        };

        Promise.all([
            DonatorService.getDonators(params),
        ]).then(results => {
            var donators = results[0].result;
            this.setState({
                donators: donators,
                pagination: {...results[0].pagination},
                loading: false,
                error: "",
            });
        }).catch(error => {
            this.setState({
                error: 'Error: Cannot load donators. Try to refresh this page.',
                loading: false
            });
        });
    }

    componentWillMount() {
        this.loadDonators();
    }

    render() {
        return (
            <div className="pure-g generalPage">
                <div className='pure-u-1-1'>
                    <center><h1>Search Donators</h1></center>
                    <Loading loading={this.state.loading}/>

                    <DonatorRegularAdvanceFilter onApplyFilterClick={this.handleApplyFilterClick}/>
                    {!this.state.loading && <div>
                        {this.state.donators.length === 0 && <NoResultsFound/>}
                        {(this.state.error === "" && this.state.donators.length !== 0) &&
                        <div>
                            <SearchResults/>
                            <div className="total-count">Total: {this.state.pagination.rowCount} donator(s)</div>
                            <DonatorList donators={this.state.donators}/>
                            <Pagination onClick={this.handlePaginationClick} pagination={this.state.pagination}/>
                        </div>
                        }

                        {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default PageGeneralSearchDonator;