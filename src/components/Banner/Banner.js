import React, { Component } from "react";
import { Link } from "react-router-dom";
import bannernft1 from "../../assets/bannernft1.png"
import bannernft2 from "../../assets/bannernft2.png"
import bannernft3 from "../../assets/bannernft3.png"
import bannernft4 from "../../assets/bannernft4.png"
import bannernft5 from "../../assets/bannernft5.png"
import meterlogo from "../../assets/meterlogo.svg"
import "./Banner.css";

class Banner extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="banner_bg">
        <div className="banner_container">
          
          <div className="banner_left">

            <h1>Co-investment, Co-benefits</h1>
            <h2>Built on 
            &nbsp;&nbsp;
              <img src={meterlogo} width="200"/> Testnet
            </h2>
            <a href="/marketplace">
            <div className="banner_btn">Marketplace</div>
            </a>
            
          </div>
          <div className="banner_right">
             <img src={bannernft1} width="200px" className="banner_animate1"/>
             <img src={bannernft2} width="200px" className="banner_animate2"/>
             <img src={bannernft3} width="200px" className="banner_animate3"/>
             <img src={bannernft4} width="200px" className="banner_animate4"/>
             {/* <img src={bannernft5} width="200px" className="banner_animate5"/> */}
          </div>
        </div>
      
      </div>
    );
  }
}
export default Banner;
