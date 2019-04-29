import React, {Component} from 'react';
import Image from "../General/Image";
import {NotificationManager} from 'react-notifications';
import {withRouter} from "react-router-dom"
import Country from "../General/Country";
import Group from "../General/Group";
import GeneralService from "../../services/GeneralService";
import IpfsService from "../../services/IpfsService";
import DonatorListItem from "./DonatorListItem";

class DonatorAdd extends Component {
    constructor(props) {
        super(props);

        console.log("EDIT PROPS: ", props.donator);
        this.state = {
            donator: props.donator,
            groups: props.groups,
            mode: props.mode,
            imageUploading: false,
            showPreview: false,
            submit: props.submit,
            invalid: {
                firstName: false,
                lastName: false,
                description: false,
                country: false,
                identifier: false,
            }
        };

        this.handleShowPreview = this.handleShowPreview.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    handleUploadImage(event) {
        const file = event.target.files[0];
        var donator = {...this.state.donator};
        donator.image = "";
        this.setState({
            uploadImageIsReady: false,
            donator: donator,
        });

        NotificationManager.info('Please wait, IPFS uploading is still in progress....', '', 5000);
        IpfsService.upload(file, console.log).then((url) => {
            NotificationManager.success('IPFS uploading - done!', '', 5000);
            donator = {...this.state.donator};
            donator.image = url;
            this.setState({
                donator: donator,
                uploadImageIsReady: true
            });
        }).catch((error) => {
            console.log(error);
            //error happen!
            this.setState({
                uploadImageIsReady: false
            });
        });
    }

    handleShowPreview(event) {
        event.preventDefault();
        if (!this.checkValidation()) {
            return false;
        }
        this.state.showPreview = true;
    }

    handleConfirm(event) {
        event.preventDefault();
        if (!this.checkValidation()) {
            return false;
        }

        this.state.submit(this.state.donator).then(() => {
            NotificationManager.info('Please wait for confirmation.', '', 5000);
            this.props.history.push('/admin/pending/donators');
        }).catch(error => {
            console.log(GeneralService.getWeb3ErrorText(error.message));
            NotificationManager.error('Cannot ' + this.state.mode + ' donator.', GeneralService.getWeb3ErrorText(error.message), 8000);
            return false;
        });
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
        if (this.state.donator.firstName === "") {
            fields.push('firstName');
            messages.push('First name is required field.');
            result = false;
        }

        if (this.state.donator.lastName === "") {
            fields.push('lastName');
            messages.push('Last name is required field.');
            result = false;
        }

        if (this.state.donator.description === "") {
            fields.push('description');
            messages.push('Description is required field.');
            result = false;
        }

        if (this.state.donator.country === "") {
            fields.push('country');
            messages.push('Country is required field.');
            result = false;
        }

        if (this.state.donator.identifier === "") {
            fields.push('identifier');
            messages.push('Identifier is required field.');
            result = false;
        }

        console.log(this.state.donator);
        this.showInvalidData(fields, messages);
        return result;
    }


    handleInputChange(event) {
        console.log("OnChange : ", event.target);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        var donator = {...this.state.donator};
        donator[name] = value;

        var invalid = {...this.state.invalid};
        invalid[name] = false;

        if (name === 'donatedDate') {
            donator['donatedYear'] = (new Date(value)).getFullYear();
        }

        this.setState({
            donator: donator,
            invalid: invalid
        });
    }

    handleChange(value) {
        var donator = {...this.state.donator};
        donator.groups = value;
        this.setState({
            donator: donator
        });
        console.log(donator);
    }

    render() {
        return (
            <div className="pure-g">
                <div className='pure-u-1-1'>
                    <h2>{this.state.mode === "add" ? "Add" : "Edit"} donator : &nbsp;</h2>
                    <form className="pure-form pure-form-stacked">
                        <input name="id" type="hidden" value={this.state.donator.id}/>
                        <fieldset>
                            <div className="pure-u-md-3-5 column-field">
                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="firstName">First name <span className="required">*</span></label>
                                    <input name="firstName"
                                           type="text"
                                           placeholder="First name"
                                           value={this.state.donator.firstName}
                                           onChange={this.handleInputChange}
                                           className={this.state.invalid.firstName ? "pure-u-md-1-1 field-error" : "pure-u-md-1-1"}
                                    />
                                </div>
                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="lastName">Last name <span className="required">*</span></label>
                                    <input name="lastName"
                                           type="text"
                                           placeholder="Last name"
                                           value={this.state.donator.lastName}
                                           onChange={this.handleInputChange}
                                           className={this.state.invalid.lastName ? "pure-u-md-1-1 field-error" : "pure-u-md-1-1"}
                                    />
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="identifier">Identifier <span className="required">*</span></label>
                                    <input name="identifier"
                                           type="text"
                                           placeholder="Identifier : email, phone number and etc."
                                           value={this.state.donator.identifier}
                                           onChange={this.handleInputChange}
                                           className={this.state.invalid.identifier ? "pure-u-md-1-1 field-error" : "pure-u-md-1-1"}
                                    />
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="country">Country <span className="required">*</span></label>
                                    <Country value={this.state.donator.country}
                                             onChange={this.handleInputChange}
                                             className={this.state.invalid.country ? "pure-u-md-23-24 field-error" : "pure-u-md-1-1"}
                                    />
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="birthday">Birthday</label>
                                    <input name="birthday" type="date" placeholder="Date"
                                           className="pure-u-md-1-1"
                                           value={this.state.donator.birthday} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="donatedDate">Donated Date</label>
                                    <input name="donatedDate" type="date" placeholder="Date"
                                           className="pure-u-md-1-1"
                                           value={this.state.donator.donatedDate} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="facebook">FaceBook</label>
                                    <input name="facebook" type="text" placeholder="FaceBook profile URL" size="40"
                                           className="pure-u-md-1-1"
                                           value={this.state.donator.facebook} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="linkedin">LinkedIn</label>
                                    <input name="linkedin" type="text" placeholder="LinkedIn profile URL" size="40"
                                           className="pure-u-md-1-1"
                                           value={this.state.donator.linkedin} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-3 field-block">
                                    <label htmlFor="twitter">Twitter</label>
                                    <input name="twitter" type="text" placeholder="Twitter profile URL" size="40"
                                           className="pure-u-md-1-1"
                                           value={this.state.donator.twitter} onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-1 field-block">
                                    <label htmlFor="description">Description <span className="required">*</span></label>
                                    <textarea name="description"
                                              rows="5"
                                              onChange={this.handleInputChange}
                                              value={this.state.donator.description}
                                              className={this.state.invalid.description ? "pure-u-md-1-1 field-error" : "pure-u-md-1-1"}
                                    ></textarea>
                                </div>

                                <div className="pure-u-md-1-2 field-block">
                                    <label htmlFor="twitter">Groups</label>
                                    <Group
                                        name="groups"
                                        onChange={this.handleChange}
                                        placeholder="Please select"
                                        className="pure-u-md-1-1"
                                        groups={this.state.groups}
                                        mode="multiple"
                                        values={this.state.donator.groups}
                                    />
                                </div>

                            </div>
                            <div className="pure-u-md-2-5">
                                <div className="pure-u-md-1-1 field-block">
                                    <label htmlFor="password">Image preview</label>
                                    <Image url={this.state.donator.image} width={150} height={150}/>
                                </div>
                                <p/>
                                <div className="pure-u-md-1-1 field-block">
                                    <label htmlFor="image">Image URL <small>(copy absolutely URL with
                                        http/https)</small></label>
                                    <input name="image" type="text" placeholder="Image URL"
                                           className="pure-u-md-2-3"
                                           value={this.state.donator.image}
                                           onChange={this.handleInputChange}/>
                                </div>

                                <div className="pure-u-md-1-1 field-block">
                                    <label htmlFor="password">
                                        <small>or upload it to ipfs</small>
                                    </label>
                                    <input type="file" name="image" placeholder="image"
                                           onChange={this.handleUploadImage}/>

                                    {this.state.imageUploading &&
                                    <small>Please, wait few seconds, uploading is still in progress...</small>}
                                </div>
                            </div>

                            {!this.state.showPreview &&
                            <div className="pure-u-md-1-1 field-block center">
                                <label></label>
                                <button type="submit" className="button-success pure-button"
                                        onClick={this.handleShowPreview}>{this.state.mode === "add" ? "Add" : "Save"}</button>
                            </div>
                            }
                        </fieldset>
                        {this.state.showPreview &&
                            <div>
                                <hr/>
                                <h2>
                                    Preview
                                </h2>
                                <DonatorListItem donator={this.state.donator} key={this.state.donator.id} />
                                <div className="pure-u-md-1-1 field-block center">
                                    <label></label>
                                    <button type="submit" className="button-success pure-button"
                                            onClick={this.handleConfirm}>Confirm</button>
                                </div>
                            </div>
                        }
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(DonatorAdd);