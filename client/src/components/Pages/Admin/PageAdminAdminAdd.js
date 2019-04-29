import React, {Component} from "react";
import AdminAdd from "../../Admin/AdminAdd";
import AdminService from "../../../services/AdminService";

class PageAdminAdminAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: AdminService.newEntity()
        };
    }

    render(){
        return (
            <AdminAdd admin={this.state.admin} mode="add" submit={AdminService.addAdmin.bind(AdminService)}/>
        );
    }
}

export default PageAdminAdminAdd;