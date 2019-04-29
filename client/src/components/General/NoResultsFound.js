import React, {Component} from 'react';

class NoResultsFound extends Component {
    render() {
        return (
            <div className="pure-g no-results-found">
                <div className='pure-u-1-1'>
                    <h2>No Results Found</h2>
                </div>
            </div>
        )
    }
}

export default NoResultsFound;