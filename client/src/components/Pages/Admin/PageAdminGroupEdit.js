import React, {Component} from "react";
import GroupAdd from "../../Group/GroupAdd";
import GroupService from "../../../services/GroupService";
import Loading from "../../General/Loading";

class PageAdminGroupEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            group: GroupService.newEntity(),
            loading: true,
            error: "",
        };
    }

    componentWillMount() {
        let id = this.props.match.params.id;
        console.log("id = ", id);
        GroupService.getGroup(id).then(group => {
            console.log("group", group);
            if (group !== null) {
                this.setState({
                    group: {...group},
                    loading: false,
                    error: "",
                });
            } else {
                console.log("donator NULL");
            }
        }).catch(error => {
            this.setState({
                loading: false,
                error: "Error: Cannot load group. Try to refresh this page.",
            });
        })
    }


    render(){
        return (
            <div>
                {this.state.loading && <Loading loading={this.state.loading}/>}
                {(this.state.error === "" && !this.state.loading) && <GroupAdd group={this.state.group} mode="edit" submit={GroupService.updateGroup.bind(GroupService)}/>}
                {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
            </div>

        );
    }
}

export default PageAdminGroupEdit;