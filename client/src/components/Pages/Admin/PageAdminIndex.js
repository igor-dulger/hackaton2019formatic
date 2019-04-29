import React, {Component} from "react";
import {Switch, Route} from 'react-router-dom'
import PageAdminAdminsPending from "./PageAdminAdminsPending";
import PageAdminAdminsShow from "./PageAdminAdminsShow";
import PageAdminDonatorAdd from "./PageAdminDonatorAdd";
import PageAdminDonatorsPending from "./PageAdminDonatorsPending";
import PageAdminDonatorEdit from "./PageAdminDonatorEdit";
import PageAdminGroupEdit from "./PageAdminGroupEdit";
import PageAdminGroupsShow from "./PageAdminGroupsShow";
import PageAdminGroupsPending from "./PageAdminGroupsPending";
import PageAdminAdminAdd from "./PageAdminAdminAdd";
import PageAdminGroupAdd from "./PageAdminGroupAdd";
import PageAdminAdminEdit from "./PageAdminAdminEdit";
import PageAdminDonatorsShow from "./PageAdminDonatorsShow";
import PendingService from "../../../services/PendingService";
import {NotificationManager} from "react-notifications";

class PageAdminAdminIndex extends Component {

    constructor(props) {
        super(props);

        this.processPendings = this.processPendings.bind(this);
        this.processedPendingsCallback = this.processedPendingsCallback.bind(this);
    }

    generateSuccessNotification(pending) {
        var action = "";
        if (pending.body.type === "add") {action = "added"}
        if (pending.body.type === "edit") {action = "updated"}
        if (pending.body.type === "delete") {action = "deleted"}

        var entityName = "";
        if (pending.body.entityType === "admin") {entityName = "Admin"}
        if (pending.body.entityType === "group") {entityName = "Group"}
        if (pending.body.entityType === "donator") {entityName = "Donator"}

        var name = ""
        if (pending.body.entityType === "admin") {name = pending.data.nickname}
        if (pending.body.entityType === "group") {name = pending.data.name}
        if (pending.body.entityType === "donator") {name = pending.data.firstName+" "+pending.data.lastName}


        if ((entityName !== "") && (action !== "") && (name !== "")) {
            return  entityName+" '"+name+"' has been "+action;
        } else {
            return "";
        }
    }

    processPendings(pendings) {
        var removeList = [];
        for (var i=0; i<pendings.length; i++) {
            if (pendings[i].completed) {
                var message = this.generateSuccessNotification(pendings[i].pending);
                if (message !== "") {
                    NotificationManager.success(message, '', 8000);
                } else {
                    message = "Unknown pending : type - '"+pendings[i].pending.body.type+"', entity - '"+pendings[i].pending.body.entityType+"'!";
                    NotificationManager.warning(message, '', 8000);
                }

                removeList.push(pendings[i].pending);
            }
        }

        PendingService.removePendings(removeList);
    }

    showProcessedPendings(processedPendings) {
        processedPendings.forEach(processedPending => {
            if (processedPending.messageType === 'success') {
                NotificationManager.success(processedPending.message, '', 8000);
            } else {
                NotificationManager.warning(processedPending.message, '', 8000);
            }
        });
    }

    processedPendingsCallback(processedPendings) {
        if (processedPendings.length > 0) {
            this.showProcessedPendings(processedPendings);
        }
    }

    componentWillMount() {
       PendingService.startCheckingPendings();
       PendingService.subscribeCheckingPendings(this.processedPendingsCallback)

        // this.checkPendingsIntervalId = setInterval(() => {
        //     var pendings = PendingService.getAllPendings();
        //     if (pendings.length > 0) {
        //         PendingService.checkPendings(pendings).then(result => {
        //             if (result.length > 0) {
        //                 this.processPendings(result);
        //             }
        //         });
        //     }
        // }, 15000);
    }

    componentWillUnmount() {
        PendingService.unsubscribeCheckingPendings(this.processedPendingsCallback)
        PendingService.stopCheckingPendings();
        // clearInterval(this.checkPendingsIntervalId);
    }

    render(){
        return (
            <div>
                <Switch>
                    <Route path='/admin/pending/admins' exact component={PageAdminAdminsPending}/>
                    <Route path='/admin/pending/groups' exact component={PageAdminGroupsPending}/>
                    <Route path='/admin/pending/donators' exact component={PageAdminDonatorsPending}/>

                    <Route path='/admin/admins' exact component={PageAdminAdminsShow}/>
                    <Route path='/admin/admins/add' exact component={PageAdminAdminAdd}/>
                    <Route path='/admin/admins/edit/:id' exact component={PageAdminAdminEdit}/>

                    <Route path='/admin/groups' exact component={PageAdminGroupsShow}/>
                    <Route path='/admin/groups/add' exact component={PageAdminGroupAdd}/>
                    <Route path='/admin/groups/edit/:id' exact component={PageAdminGroupEdit}/>

                    <Route path='/admin/donators' exact component={PageAdminDonatorsShow}/>
                    <Route path='/admin/donators/add' exact component={PageAdminDonatorAdd}/>
                    <Route path='/admin/donators/edit/:id' exact component={PageAdminDonatorEdit}/>
                </Switch>
            </div>
        );
    }
}

export default PageAdminAdminIndex;