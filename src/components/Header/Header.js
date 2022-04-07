import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  message,
  Modal,
  Divider,
  Input,
  Menu,
  Dropdown,
  Popover,
} from "antd";

import web3 from "web3";
import "./Header.css";
import logo from "../../assets/CONFT.svg";
import menuicon from "../../assets/menu.svg";
import chainids from "../../libs/chainIds";

class Header extends Component {
  async componentDidMount() {
    const { ethereum } = window;

    var that = this;

    if (ethereum && ethereum.isMetaMask) {
      that.initAccount();
      that.changeNetwork();

      window.ethereum.on("accountsChanged", function () {
        that.initAccount();
      });
      window.ethereum.on("chainChanged", function () {
        that.changeNetwork();
      });
    } else {
  
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      currentAddress: "",
      isInit: false,
      visible: false,
      showConnectNetwork: false,
      networkName: "",
      networkColor: "#FFF",
    };
  }

  render() {
    return (
      <div>
        <Modal
          title="Info"
          footer={null}
          visible={this.state.showConnectNetwork}
          onCancel={this.closeModals}
        >
          <p>Please Connect Meter Test Network.</p>
          <div className="connectNetworkButton" onClick={this.addNetwork}>
            Connect 
          </div>
        </Modal>

  


        <div className="header_container">
      
          <div className="header_container_content">
            <div className="logo">
              <Link to="/">
                <img src={logo} width="100" />
              </Link>
            </div>

            <div className="menu_icon" onClick={this.showDrawer}>
              <img src={menuicon} width="28" />
            </div>
            <Drawer
              title="Menu"
              placement="right"
              closable={false}
              onClose={this.closeDialog}
              visible={this.state.visible}
            >
              <Link to="/marketplace">
                <div className="menu_item">Marketplace</div>
              </Link>
              <Link to="/addnft">
                <div className="menu_item">Add NFT</div>
              </Link>
              <Link to="/history">
                <div className="menu_item">History</div>
              </Link>
       

              {this.state.currentAddress == "" ? (
                <div
                  className="header_connect_btn"
                  onClick={this.addNetwork}
                >
                  CONNECT WALLET <br/><span>Meter Testnet</span> 
                </div>
              ) : (
                <div className="menu_item">
                  <span>{this.address}&nbsp;&nbsp;&nbsp;</span>
                </div>
              )}
            </Drawer>


            <div className="nav">
   
           
        
              <Link to="/marketplace">
                <div className="nav_item">Marketplace</div>
              </Link>
              <Link to="/addnft">
                <div className="nav_item">Add NFT</div>
              </Link>
              <Link to="/history">
                <div className="nav_item">History</div>
              </Link>
   
              {this.state.currentAddress == "" ? (
                <div
                  className="header_connect_btn"
                  onClick={this.addNetwork}
                >
                  CONNECT WALLET <br/><span>Meter Testnet</span> 
                </div>
              ) : (
                <Link to="/history">
                  <div className="nav_item">

                   

                    <span style={{ color: this.state.networkColor }}>
                      {this.state.networkName}&nbsp;
                    </span>
                 
                    {this.address}
                    &nbsp;
                   
                    
                  </div>
              </Link>
      
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  get address() {
    let end = this.state.currentAddress.length;
    let addressShort =
      this.state.currentAddress.substring(0, 5) +
      "..." +
      this.state.currentAddress.substring(end - 4, end);
    return addressShort;
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  closeDialog = () => {
    this.setState({ visible: false });
  };

  initAccount = async () => {
    var that = this;
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts[0] != null) {
      that.setState({
        currentAddress: accounts[0],
      });
    }
  };

  handleConnect = async () => {





    var that = this;
    const { ethereum } = window;

    if (ethereum && ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0] != null) {
        that.setState({
          currentAddress: accounts[0],
        });
      }
    } else {
      message.warning(
        "Please install metamask and switch to Network.",
        3
      );
    }

  };


  addNetwork=async()=>{

 
    var params = [
      {
        "chainId": "0x53",
        "chainName": "Meter Testnet",
        "rpcUrls": ["https://rpctest.meter.io"],
        "nativeCurrency": {
          "name": "MTR",
          "symbol": "MTR",
          "decimals": 18
        },
        "blockExplorerUrls": ["https://scan-warringstakes.meter.io/"]
      }
    ]

    try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x53' }],
        });
        await this.handleConnect();
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: params,
            });
            await this.handleConnect();
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    
      this.setState({
        showConnectNetwork:false
      })

}







  

  closeModals = () => {
    this.setState({
      showConnectNetwork: false,
    });
  };

  changeNetwork = async () => {
    var that = this;
    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    var chainId = web3.utils.hexToNumber(chainIdHex);
    
    if(chainId!="83"){
      this.setState({
        showConnectNetwork:true
      })
    }


    for (var item in chainids) {
      if (chainId == chainids[item].ChainId) {
        that.setState({
          networkName: chainids[item].NetworkName,
          networkColor: chainids[item].FontColor,
        });
        break;
      }
    }


  };

  
}
export default Header;
