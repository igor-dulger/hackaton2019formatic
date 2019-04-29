import React, {Component} from "react";
import {Link} from 'react-router-dom';
import DonatorGrid from "../../Donator/DonatorGrid";
import DonatorService from "../../../services/DonatorService";
import Loading from "../../General/Loading";
import PendingService from "../../../services/PendingService";
import Pagination from "../../General/Pagination";
import DonatorAdminFilter from "../../Donator/DonatorAdminFilter";
import GroupService from "../../../services/GroupService";
import SearchResults from "../../General/SearchResults";
import NoResultsFound from "../../General/NoResultsFound";

class PageAdminDonatorsShow extends Component {
    constructor(props) {
        super(props);
        this.order = {
            field: "id",
            direction: "asc"
        };
        this.currentPage = 1;
        this.filters = {
        };

        this.state = {
            donators: [],
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: 10,
                rowCount: 1
            },
            pendings: [],
            groups: [],
            loading: true,
            error: "",
        }

        this.handlePaginationClick = this.handlePaginationClick.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.handleApplyFilterClick = this.handleApplyFilterClick.bind(this);
    }

    loadDonators() {
        var params = {...this.filters,
            order: {
                field: this.order.field,
                direction: this.order.direction
            },
            page: this.currentPage
        };

        Promise.all([
            DonatorService.getDonators(params),
            PendingService.getDonatorPendings(),
            GroupService.getGroups()
        ]).then(results => {
            var donators = results[0].result;
            this.setState({
                donators: donators,
                pagination: {...results[0].pagination},
                pendings: PendingService.findPendings('donator', donators, results[1]),
                groups: results[2],
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

    reLoadDonators() {
        this.setState({
            loading: true,
        });
        this.loadDonators();
    }

    handlePaginationClick(page) {
        this.currentPage = page;
        this.reLoadDonators();
    }

    handleSortClick(field) {
        if (this.order.field === field) {
            this.order.direction = (this.order.direction === 'asc') ? 'desc' : 'asc';
        } else {
            this.order.direction = 'asc';
        }
        this.order.field = field;
        this.currentPage = 1;

        this.reLoadDonators();
    }

    handleApplyFilterClick(filters) {
        console.log("FILTERS: ", filters);
        this.filters = {...filters};
        this.reLoadDonators();
    }

    componentWillMount() {
        this.loadDonators();
    }

    render() {
        return (
            <div>
                <h1>Donators</h1>
                <div className="donator-menu">
                    <Link to='/admin/donators' className="pure-button pure-button-disabled">Active</Link>&nbsp;
                    <Link to='/admin/pending/donators' className="pure-button">Pending</Link>&nbsp;
                    <Link to='/admin/donators/add' className="pure-button">Add new donator</Link>&nbsp;
                </div>
                <DonatorAdminFilter onApplyFilterClick={this.handleApplyFilterClick} groups={this.state.groups}/>

                <Loading loading={this.state.loading}/>
                {!this.state.loading && <div>
                    {this.state.donators.length === 0 && <NoResultsFound />}
                    {(this.state.error === "" && this.state.donators.length !== 0) && <div>
                        <SearchResults/>
                        <div className="total-count">Total: {this.state.pagination.rowCount} donator(s)</div>
                        <DonatorGrid
                            donators={this.state.donators}
                            pendings={this.state.pendings}
                            remove={DonatorService.removeDonator.bind(DonatorService)}
                            currentSort={this.order.field}
                            currentDirection={this.order.direction}
                            onSortClick={this.handleSortClick}
                        />
                        <Pagination onClick={this.handlePaginationClick} pagination={this.state.pagination}/>
                    </div>}

                    {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
                </div>
                }
            </div>
        );
    }
}

export default PageAdminDonatorsShow;