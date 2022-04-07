import React, { Component } from "react";
import "./About.css";
import icon1 from "../../assets/icon1.svg"
import icon2 from "../../assets/icon2.svg"
import icon3 from "../../assets/icon3.svg"
import icon4 from "../../assets/icon4.svg"
class About extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="about_bg">
          <div className="about_top">
            <span className="about_tit">How It Work</span>
          </div>
          <div className="about_bottom">
        
              <div className="about_item">
                <img src={icon1} width="64"></img>
                <h1>List nft to the market</h1>
                <p>Alice adds an NFT in <a href="/addnft">Add NFT</a> and sets its price to 10 MTR, it is displayed on <a href="/marketplace">MarketPlace</a> and others can buy it.</p>
              </div>
              <div className="about_item">
              <img src={icon2} width="64"></img>
                <h1>Co-investment</h1>
                <p>Bob found it, but he didn't have enough money, he only paid 4 MTR, and he expected the future price of this NFT to be 20 MTR.
                  Carol also found it and paid the remaining 6 MTR, which he expects the future price of this NFT to be 30 MTR.</p>
              </div>
              <div className="about_item">
              <img src={icon3} width="64"></img>
                <h1>Re-list</h1>
                <p>Because the total amount paid by Bob and Carol has reached the price set by Alice, the NFT is traded, Alice gets 10 MTR, and the NFT is relisted. The new price listed is 25 MTR, which is the average (20+30)/2 of the expected prices entered by Bob and Carol at the time of purchase.</p>
              </div>
              <div className="about_item">
              <img src={icon4} width="64"></img>
                <h1>Co-benefits</h1>
                <p>
                  Dave admired this NFT very much, so he directly paid 25 MTR to buy it. When this NFT is purchased by Dave, the income will be distributed to Bob and Carol proportionally. Bob gets 10 MTR (4/10*25) and Carol gets 15 MTR (6/10*25).
                  Bob and Carol invested in the NFT together, and they gained 6 MTR (10-4) and 9 MTR (15-6) respectively.
                </p>
              </div>
            


          </div>

        </div>


      </div>
    );
  }
}
export default About;