import React, { Component } from "react";
import "./Introduce.css";
class Introduce extends Component{
    constructor(props){
      super(props)
    }
    render(){
        return(
            <div>
                <div className="introduce_container">
                    <div className="introduce_tit">
                        What is CONFT?
                    </div>
                    <div className="introduce_content">
                    CONFT adopts a co-investment approach. Everyone only needs to pay a part of the funds, they can buy a part of the NFT, and they can get the pricing power of the next sale of the NFT. When the NFT is sold, they can get some benefits from the price difference.
                    </div>

                    <a href="/addnft">
                    <div className="addmynftbtn">
                        Add MY NFT
                    </div>
                    </a>
                </div>
            </div>
        )
    }
}
export default Introduce;
