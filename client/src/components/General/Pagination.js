import React, {Component} from 'react';
import PaginationPage from "./PaginationPage";

class Pagination extends Component {

    constructor() {
        super();

        this.getClickHandler = this.getClickHandler.bind(this);
    }

    componentWillMount() {
        var pagination = this.props.pagination;
        var onClick = this.props.onClick;

        var pages = [];

        for (var i=1; i<=pagination.pageCount; i++) {
            if ((i===1) || (i===pagination.pageCount) || ((i>=pagination.page - 2) && (i<=pagination.page + 2))) {
                pages.push({
                    page: i,
                    label: i.toString()
                });
            } else {
                if (pages[pages.length-1].label !== '...') {
                    pages.push({
                        page: i,
                        label: '...'
                    });
                }
            }
        }

        console.log('PAGINATIONS! -> ', pages);
        this.setState({
            pagination: {...pagination},
            onClick: onClick,
            pages: pages
        });
    }

    getClickHandler(page) {
        return (event) => {
            this.state.onClick(page);
        }
    }

    render() {
        return (
            <div className="pure-menu pure-menu-horizontal pagination">

                <ul className="pure-menu-list">
                    {this.state.pages.map((page) => <PaginationPage key={page.page} currentPage={this.state.pagination.page} page={page} onClick={this.getClickHandler(page.page)}/>) }
                </ul>
            </div>
        )
    }
}

export default Pagination;