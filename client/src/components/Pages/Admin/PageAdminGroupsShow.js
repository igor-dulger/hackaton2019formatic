import React, {Component} from "react";
import {Link} from 'react-router-dom';
import GroupGrid from "../../Group/GroupGrid";
import GroupService from "../../../services/GroupService";
import Loading from "../../General/Loading";
import PendingService from "../../../services/PendingService";

class PageAdminGroupsShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            pendings: [],
            loading: true,
            error: "",
        }
    }

    componentWillMount() {
        GroupService.getGroups().then((groups) => {
            PendingService.getGroupPendings().then((pendings) => {
                var hasPendings = PendingService.findPendings('group', groups, pendings);
                console.log("pendings :", pendings);
                console.log("hasPendings :", hasPendings);

                this.setState({
                    groups: groups,
                    pendings: hasPendings,
                    loading: false,
                    error: "",
                });
            });
        }).catch(error => {
            this.setState({
                error: 'Error: Cannot load groups. Try to refresh this page.',
                loading: false
            });
        });
    }

    render() {
        return (
            <div>
                <h1>Groups</h1>
                <Loading loading={this.state.loading}/>

                {!this.state.loading && <div>
                    <div className="donator-menu">
                        <Link to='/admin/groups' className="pure-button pure-button-disabled">Active</Link>&nbsp;
                        <Link to='/admin/pending/groups' className="pure-button">Pending</Link>&nbsp;
                        <Link to='/admin/groups/add' className="pure-button">Add new group</Link>&nbsp;
                    </div>
                    {this.state.error === "" && <div className="total-count">Total: {this.state.groups.length} group(s)</div>}
                    {this.state.error === "" && <GroupGrid groups={this.state.groups} pendings={this.state.pendings} remove={GroupService.removeGroup.bind(GroupService)}/>}
                    {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
                </div>
                }
            </div>
        );
    }
}

export default PageAdminGroupsShow;