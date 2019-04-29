import React, {Component} from "react";
import DonatorAdd from "../../Donator/DonatorAdd";
import DonatorService from "../../../services/DonatorService";
import Loading from "../../General/Loading";
import GroupService from "../../../services/GroupService";

class PageAdminDonatorEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            donator: DonatorService.newEntity(),
            groups: [],
            loading: true,
            error: "",
        };
    }

    componentWillMount() {
        let id = this.props.match.params.id;
        console.log("id = ", id);
        DonatorService.getDonator(id)
            .then(donator => {
                GroupService.getGroups().then(groups => {
                    console.log("donator", donator);
                    if (donator !== null) {
                        this.setState({
                            donator: {...donator},
                            groups: groups,
                            loading: false,
                            error: "",
                        });
                    } else {
                        console.log("donator NULL");
                    }
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: "Error: Cannot load donator. Try to refresh this page.",
                });
            });
    }

    render() {
        return (
            <div>
                {this.state.loading && <Loading loading={this.state.loading}/>}
                {(!this.state.loading && this.state.error === "") &&
                <DonatorAdd donator={this.state.donator}
                            groups={this.state.groups}
                            mode="edit"
                            submit={DonatorService.updateDonator.bind(DonatorService)}
                />}
                {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
            </div>

        );
    }
}

export default PageAdminDonatorEdit;