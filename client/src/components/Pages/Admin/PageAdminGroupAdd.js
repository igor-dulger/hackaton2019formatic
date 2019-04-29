import React, {Component} from "react";
import GroupAdd from "../../Group/GroupAdd";
import GroupService from "../../../services/GroupService";

class PageAdminGroupAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: GroupService.newEntity()
        };
    };

    render() {
        return (
            <GroupAdd group={this.state.group} mode="add" submit={GroupService.addGroup.bind(GroupService)}/>
        );
    }
}

export default PageAdminGroupAdd;