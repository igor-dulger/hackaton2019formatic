import React, {Component} from 'react';
import Image from "../General/Image";

class DonatorListItem extends Component {

    render() {
        return (
            <div className="pure-g donator-block">
                <div className="pure-u-1-4">
                    <Image url={this.props.donator.image} width="250" height="250"/>
                </div>
                <div className="pure-u-3-4">
                    <div className="donator-info">{this.props.donator.firstName+' '+this.props.donator.lastName+', '+this.props.donator.country}</div>
                    <div className="donator-description">{this.props.donator.description}</div>
                    <div className="donator-social">
                        {this.props.donator.twitter && <a href={this.props.donator.twitter} target="_blank" rel="noopener noreferrer"><img src="/img/twitter-24.png" alt="twitter" /></a>}
                        {this.props.donator.facebook && <a href={this.props.donator.facebook} target="_blank" rel="noopener noreferrer"><img src="/img/facebook-24.png" alt="facebook" /></a>}
                        {this.props.donator.linkedin && <a href={this.props.donator.linkedin} target="_blank" rel="noopener noreferrer"><img src="/img/linkedin-6-24.png" alt="linkedin" /></a>}
                    </div>
                    <div className="pure-g donator-other-info">
                        <div className="pure-u-1-2">Donated Year: {this.props.donator.donatedYear}</div>
                        <div className="pure-u-1-2">
                            <div>
                                Blockchain hash:<br />
                                <a href={"https://etherscan.io/tx/"+this.props.donator.createdTxHash} target="_blank" rel="noopener noreferrer">{this.props.donator.createdTxHash}</a>
                            </div>
                            <div>
                                Block height: {this.props.donator.createdBlockId}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DonatorListItem;