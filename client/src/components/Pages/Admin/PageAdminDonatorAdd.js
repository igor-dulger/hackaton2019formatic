import React, {Component} from "react";
import DonatorAdd from "../../Donator/DonatorAdd";
import DonatorService from "../../../services/DonatorService";
import GroupService from "../../../services/GroupService";
import Loading from "../../General/Loading";

class PageAdminDonatorAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donator: DonatorService.newEntity(),
            groups: [],
            loading: true,
        };
    }

    componentWillMount() {
        GroupService.getGroups().then(groups => {
            this.setState({
                loading: false,
                groups: groups
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.loading && <Loading loading={this.state.loading}/>}
                {!this.state.loading &&
                <DonatorAdd donator={this.state.donator}
                            groups={this.state.groups}
                            mode="add"
                            submit={DonatorService.addDonator.bind(DonatorService)}
                />}
            </div>
        );
    }
}

export default PageAdminDonatorAdd;