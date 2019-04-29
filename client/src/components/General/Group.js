import React, {Component} from 'react';
import {Select} from 'antd';

const {Option} = Select;

class Group extends Component {

    customFilter(search, option) {
        console.log("search", search);
        console.log("option", option.props);

        return option.props.children.toUpperCase().indexOf(search.toUpperCase()) >= 0;
    }

    render() {
        return (
            <Select
                name={this.props.name}
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                style={this.props.style}
                className={this.props.className}
                mode={this.props.mode || ""}
                filterOption={this.customFilter}
                defaultValue={this.props.values}
                allowClear={true}
            >
                {this.props.groups.map(group => (
                    <Option id={group.id} key={group.id} value={group.id}>{group.name}</Option>
                ))}
            </Select>
        )
    }
}

export default Group;