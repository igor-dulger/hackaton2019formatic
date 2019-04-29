import React, {Component} from 'react';

class PendingStatus extends Component {

    render() {
        return (
            <span>
                {this.props.pendingType === "add" && <span>Adding</span>}
                {this.props.pendingType === "edit" && <span>Editing</span>}
                {this.props.pendingType === "delete" && <span>Deleting</span>}
            </span>

        )
    }
}

export default PendingStatus;