import React, {Component} from 'react';
import DonatorService from "../../services/DonatorService";
import Loading from "./Loading";

class ShowMore extends Component {

    constructor(props) {
        super(props);

        console.log("SHOW MORE props: ", props);
        this.state = {
            isLoading: false,
        };
        this.handleShowMore = this.handleShowMore.bind(this);
    }

    handleShowMore() {
        this.setState({isLoading: true});
        let filters = {idTo: this.props.lastId-1, pageSize: this.props.pageSize, order: {field: 'id', direction: 'desc'}};
        if (this.props.groupId !== undefined) {
            filters["groupId"] = this.props.groupId;
        }
        console.log("FILTERS", filters);
        return DonatorService.getDonators(filters).then(response => {
            this.setState({isLoading: false});
            return this.props.addDonatorsToGroupHandle(this.props.groupIndex, response);
        });
    }

    render() {
        return (
            <div className="pure-g search-results">
                <div className='pure-u-1-1'>
                    {!this.state.isLoading && <center><button type="submit" className="button-success pure-button"
                                                              onClick={this.handleShowMore}>Show more</button></center>}
                    {this.state.isLoading && <center><Loading loading={this.state.isLoading}/> </center>}

                </div>
            </div>
        )
    }
}

export default ShowMore;