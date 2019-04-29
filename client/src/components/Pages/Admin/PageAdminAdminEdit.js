import React, {Component} from "react";
import AdminAdd from "../../Admin/AdminAdd";
import AdminService from "../../../services/AdminService";
import Loading from "../../General/Loading";

class PageAdminAdminEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: AdminService.newEntity(),
            loading: true,
            error: "",
        };
    }

    componentWillMount() {
        let id = this.props.match.params.id;
        console.log("id = ", id);
        AdminService.getAdmin(id).then(admin => {
            console.log("admin", admin);
            if (admin !== null) {
                this.setState({
                    admin: {...admin},
                    loading: false,
                    error: "",
                });
            }
        }).catch(error => {
            this.setState({
                error: 'Error: Cannot load admin. Try to refresh this page.',
                loading: false
            });
        })
    }

    render(){
        return (
            <div>
                {this.state.loading && <Loading loading={this.state.loading}/>}
                {(!this.state.loading && this.state.error === "") && <AdminAdd admin={this.state.admin} mode="edit" submit={AdminService.updateAdmin.bind(AdminService)}/>}
                {this.state.error !== "" && <div className="error-panel">{this.state.error}</div>}
            </div>
        );
    }
}

export default PageAdminAdminEdit;