import React, {Component} from 'react';
import { Link } from 'react-router-dom'

class Menu extends Component {

    render() {
        return (
            <nav className="navbar pure-menu pure-menu-horizontal">
                <Link to='/' className="pure-menu-heading pure-menu-link">Home page</Link>
                { this.props.roles.isOwner && <Link to='/admin/admins' className="pure-menu-heading pure-menu-link">Admins</Link> }
                { this.props.roles.isAdmin && <Link to='/admin/groups' className="pure-menu-heading pure-menu-link">Groups</Link> }
                { this.props.roles.isAdmin && <Link to='/admin/donators' className="pure-menu-heading pure-menu-link">Donators</Link> }
                { this.props.account && <span className="pure-menu sm-right">Current account: {this.props.account}</span> }
            </nav>
        )
    }
}

export default Menu;