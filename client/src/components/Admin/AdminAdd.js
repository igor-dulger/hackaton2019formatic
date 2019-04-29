import React, {Component} from 'react';
import {NotificationManager} from 'react-notifications';
import {withRouter} from "react-router-dom"
import GeneralService from "../../services/GeneralService";

class AdminAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: props.admin,
            mode: props.mode,
            submit: props.submit,
            invalid: {
                nickname: false,
                address: false
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.checkValidation()) {
            return false;
        }

        try {
            this.state.submit(this.state.admin).then(() => {
                NotificationManager.info('Please wait for confirmation.', '', 5000);
                this.props.history.push('/admin/pending/admins');
            }).catch(error => {
                console.log(GeneralService.getWeb3ErrorText(error.message));
                NotificationManager.error('Cannot '+this.state.mode+' admin.', GeneralService.getWeb3ErrorText(error.message), 8000);
                return false;
            });
        } catch (error) {
            if (error.message.indexOf('invalid address') >= 0) {
                this.showInvalidData(['address'], ['Invalid address.']);
            }
            return false;
        }
        return true;
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
        if (this.state.admin.nickname === "") {
            fields.push('nickname');
            messages.push('Nickname is required field.');
            result = false;
        }

        if (this.state.admin.address === "") {
            fields.push('address');
            messages.push('Address is required field.');
            result = false;
        }

        this.showInvalidData(fields, messages);
        return result;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        var admin = {...this.state.admin};
        admin[name] = value;

        var invalid = {...this.state.invalid};
        invalid[name] = false;
        this.setState({
            admin: admin,
            invalid: invalid
        });
    }

    render() {
        console.log('FORM STATE: ', this.state);
        return (
            <div className="pure-g">
                <div className='pure-u-1-1'>
                    <h2>{this.state.mode === "add" ? "Add" : "Edit"} admin : &nbsp;</h2>
                    <form className="pure-form pure-form-aligned">
                        <input name="id" type="hidden" value={this.state.admin.id}/>
                        <fieldset>
                            <div className="pure-control-group">
                                <label htmlFor="name">Nickname <span className="required">*</span></label>
                                <input name="nickname"
                                       type="text"
                                       placeholder="Nickname"
                                       value={this.state.admin.nickname}
                                       onChange={this.handleInputChange}
                                       className={this.state.invalid.nickname ? "field-error" :  ""}
                                />
                            </div>

                            <div className="pure-control-group">
                                <label htmlFor="address">Admin address <span className="required">*</span></label>
                                <input name="address"
                                       type="text"
                                       placeholder="Admin address"
                                       size="40"
                                       value={this.state.admin.address}
                                       onChange={this.handleInputChange}
                                       className={this.state.invalid.address ? "field-error" :  ""}
                                />
                            </div>

                            <div className="pure-control-group">
                                <label></label>
                                <button type="submit" className="button-success pure-button"
                                        onClick={this.handleSubmit}>{this.state.mode === "add" ? "Add" : "Save"}</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(AdminAdd);