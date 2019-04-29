import React, {Component} from 'react';
import GroupService from "../../../services/GroupService";
import DonatorService from "../../../services/DonatorService";
import DonatorList from "../../Donator/DonatorList";
import Loading from "../../General/Loading";
import DonatorRegularFilter from "../../Donator/DonatorRegularFilter";
import SearchResults from "../../General/SearchResults";
import NoResultsFound from "../../General/NoResultsFound";
import ShowMore from "../../General/ShowMore";
import DonatorSimpleList from "../../Donator/DonatorSimpleList";

class PageGeneralIndex extends Component {

    constructor(props) {
        super(props);

        this.state = {
            indexPage: true,
            donatorsByGroup: [],
            allDonators: {},
            groups: [],
            loading: true,
            foundDonators: [],
            error: ""
        }

        this.searchByFirstOrLastName = this.searchByFirstOrLastName.bind(this);
        this.addDonatorsToGroupHandle = this.addDonatorsToGroupHandle.bind(this);
    }

    searchByFirstOrLastName(firstOrLastName) {
        if (firstOrLastName === "") {
            this.setState({
                indexPage: true
            });
            return;
        }
        ;

        var params = {
            searchQuery: firstOrLastName,
            order: {
                field: 'id',
                direction: 'desc'
            },
            page: this.currentPage
        };

        this.setState({loading: true});

        DonatorService.getDonators(params).then(results => {
            this.setState({
                indexPage: false,
                foundDonators: results.result,
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

    addDonatorsToGroupHandle(index, response) {
        console.log("---------SHOW MORE-------------");
        console.log(index, response);

        if (index !== undefined) {
            var newDonatorsByGroup = JSON.parse(JSON.stringify(this.state.donatorsByGroup));
            newDonatorsByGroup[index].result = newDonatorsByGroup[index].result.concat(response.result);
            newDonatorsByGroup[index].pagination = response.pagination;

            console.log(newDonatorsByGroup);

            this.setState({
                donatorsByGroup: newDonatorsByGroup
            });
        } else {
            var allDonators = JSON.parse(JSON.stringify(this.state.allDonators));
            allDonators.result = allDonators.result.concat(response.result);
            allDonators.pagination = response.pagination;

            console.log(allDonators);

            this.setState({
                allDonators: allDonators
            });
        }
    }

    componentWillMount() {
        GroupService.getGroups().then(groups => {
            var promises = groups.map(group => DonatorService.getDonators({
                groupId: group.id,
                pageSize: 5,
                order: {field: 'id', direction: 'desc'}
            }));
            promises = promises.concat([
                DonatorService.getDonators({
                    pageSize: 20,
                    order: {field: 'id', direction: 'desc'}
                })
            ]);
            Promise.all(promises).then(
                results => {
                    let allDonators = results[results.length - 1];
                    results.splice(-1,1);

                    console.log("donatorsByGroup", results);
                    console.log("Groups", groups);

                    this.setState({
                        indexPage: true,
                        donatorsByGroup: results,
                        allDonators: allDonators,
                        groups: groups,
                        loading: false,
                        error: ""
                    });
                }
            );
        });
    }

    render() {
        return (
            <div className="pure-g generalPage">
                <div className='pure-u-1-1'>
                    <DonatorRegularFilter onApplyFilterClick={this.searchByFirstOrLastName}/>
                    <center><h1>Hall of Fame</h1></center>
                    <Loading loading={this.state.loading}/>

                    {(!this.state.loading && this.state.indexPage) && <div>
                        {this.state.groups.map((group, index) => <div className="group-donators-block" key={group.code}>
                            <center><h2>{group.description}</h2></center>
                            <DonatorList donators={this.state.donatorsByGroup[index].result}/>
                            {this.state.donatorsByGroup[index].pagination.rowCount > this.state.donatorsByGroup[index].pagination.pageSize &&
                            <ShowMore
                                lastId={this.state.donatorsByGroup[index].result[this.state.donatorsByGroup[index].result.length - 1].id}
                                groupId={group.id}
                                groupIndex={index}
                                pageSize="5"
                                addDonatorsToGroupHandle={this.addDonatorsToGroupHandle}
                            />
                            }
                        </div>)}

                        <div className="group-donators-block" key="all-donators">
                            <center><h2>All donators</h2></center>
                            <DonatorSimpleList donators={this.state.allDonators.result}/>
                            {this.state.allDonators.pagination.rowCount > this.state.allDonators.pagination.pageSize &&
                            <ShowMore
                                lastId={this.state.allDonators.result[this.state.allDonators.result.length - 1].id}
                                pageSize="20"
                                addDonatorsToGroupHandle={this.addDonatorsToGroupHandle}
                            />
                            }
                        </div>

                    </div>}

                    {(!this.state.loading && !this.state.indexPage) && <div>
                        <SearchResults/>
                        {this.state.foundDonators.length > 0 && <DonatorList donators={this.state.foundDonators}/>}
                        {this.state.foundDonators.length === 0 && <NoResultsFound/>}
                    </div>}

                    {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
                </div>
            </div>
        )
    }
}

export default PageGeneralIndex;