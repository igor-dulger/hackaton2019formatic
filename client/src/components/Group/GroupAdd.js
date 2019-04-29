import React, {Component} from 'react';
import PendingService from "../../services/PendingService";
import {withRouter} from "react-router-dom"
import {NotificationManager} from 'react-notifications';
import GeneralService from "../../services/GeneralService";

class GroupAdd extends Component {
    constructor(props){
        super(props);

        this.state = {
            group: props.group,
            mode: props.mode,
            submit: props.submit,
            invalid: {
                name: false,
                description: false,
                code: false,
            },
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        console.log('Pending Array', PendingService.getAllPendings());
    }

    showInvalidData(fields, messages) {
        var invalid = {...this.state.invalid};
        fields.map((field) => {
            invalid[field] = true;
            return invalid[field];
        });
        this.setState({
            invalid: invalid
        });
        messages.map(message => NotificationManager.error(message, '', 8000));
    }

    checkValidation() {
        var fields = [];
        var messages = [];
        var result = true;
        if (this.state.group.name === "") {
            fields.push('name');
            messages.push('Name is required field.');
            result = false;
        }

        if (this.state.group.description === "") {
            fields.push('description');
            messages.push('Description is required field.');
            result = false;
        }

        if (this.state.group.code === "") {
            fields.push('code');
            messages.push('Code is required field.');
            result = false;
        }

        this.showInvalidData(fields, messages);
        return result;
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.checkValidation()) {
            return false;
        }

        this.state.submit(this.state.group).then(() => {
            NotificationManager.info('Please wait for confirmation.', '', 5000);
            this.props.history.push('/admin/pending/groups');
        }).catch(error => {
            console.log(GeneralService.getWeb3ErrorText(error.message));
            NotificationManager.error('Cannot '+this.state.mode+' group.', GeneralService.getWeb3ErrorText(error.message), 8000);
            return false;
        });

        return true;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        var group = {...this.state.group};
        group[name] = value;

        var invalid = {...this.state.invalid};
        invalid[name] = false;

        this.setState({
            group: group,
            invalid: invalid,
        });
    }

    render() {
        return (
            <div className="pure-g">
                <div className='pure-u-1-1'>
                    <h2>{this.state.mode === "add" ? "Add" : "Edit"} group : &nbsp;</h2>
                    <form className="pure-form pure-form-aligned">
                        <input name="id" type="hidden" value={this.state.group.id} />
                        <fieldset>
                            <div className="pure-control-group">
                                <label htmlFor="name">Name <span className="required">*</span></label>
                                <input name="name"
                                       type="text"
                                       placeholder="Name"
                                       value={this.state.group.name}
                                       onChange={this.handleInputChange}
                                       className={this.state.invalid.name ? "field-error" :  ""}
                                />
                            </div>

                            <div className="pure-control-group">
                                <label htmlFor="description">Description <span className="required">*</span></label>
                                <textarea name="description"
                                          value={this.state.group.description}
                                          rows="5"
                                          cols="40"
                                          onChange={this.handleInputChange}
                                          className={this.state.invalid.description ? "field-error" :  ""}
                                ></textarea>
                            </div>

                            <div className="pure-control-group">
                                <label htmlFor="code">Code <span className="required">*</span></label>
                                <input name="code"
                                       type="text"
                                       placeholder="Code"
                                       value={this.state.group.code}
                                       onChange={this.handleInputChange}
                                       className={this.state.invalid.code ? "field-error" :  ""}
                                /> <small>(Human readable group identifier)</small>
                            </div>

                            <div className="pure-control-group">
                                <label></label>
                                <button type="submit" className="button-success pure-button" onClick={this.handleSubmit}>{this.state.mode === "add" ? "Add" : "Save"}</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(GroupAdd);