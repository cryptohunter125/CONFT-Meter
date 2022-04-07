import React, { Component } from "react";
import "./Learn.css";
import learnimg from "../../assets/learnimg.png"
class Learn extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <div className="learn_container">
         
                    <img width="300" src={learnimg}></img>
                    <div className="learn_info">
                        <div className="learn_tit">Why CONFT is an innovative way to invest in NFTs</div>
                        <div className="learn_content">
                            Never miss an opportunity to invest in NFTs<br/>
                            Share risk with multiple individual investors<br/>
                            Every re-listing is done automatically<br/>
                            Fully decentralized, you can add any ERC721 standard NFT<br/>
                            No commissions and service fees<br/>
                            Fair pricing power<br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Learn;
