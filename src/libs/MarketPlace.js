import Web3 from "web3";
import MarketPlaceAbi from "../abi/MarketPlace.json";
import ERC721 from "../abi/ERC721.json";
import axios from "axios";
class MarketPlace {
  constructor(network) {
    this.web3 = new Web3(window.ethereum);
    this.network= network;
    this.contract = new this.web3.eth.Contract(
      MarketPlaceAbi["abi"],
      network.MarketPlace
    );
  }

  async approve(_nftAddress,_from,_tokenId){
      var contract = new this.web3.eth.Contract(
        ERC721["abi"],
        _nftAddress
      );;
      var result=await contract.methods
        .approve(this.network.MarketPlace, _tokenId)
        .send({ from: _from })
        .on("transactionHash", function (hash) {
          console.info(hash);
        })
        .on("receipt", function (receipt) {
          console.info(receipt);
          return receipt;
      });
      return result;
  }

  async addNFTToMarketPlace(_contractAddress,_price,_tokenId,_from){
    var result = await this.contract.methods
    .addNFTtoMarket(_contractAddress,_price,_tokenId)
    .send({ from: _from})
    .on("transactionHash", function (hash) {
        console.info(hash);
        // return hash;
    })
    .on("receipt", function (receipt) {
      return receipt;
    });
    return result;
  }

  async getMarketPlaceData(_pageNum,_pageSize){
    
    let marketIds = await this.contract.methods
    .getNFTs( _pageNum, _pageSize)
    .call();

    let nftData = [];

    for (let i = 0; i < marketIds.length ; i++) {
   
      if(marketIds[i]!=0){
        let nftItem = await this.contract.methods
        .markets(marketIds[i])
        .call();
  
        let tokenURI=await this.getTokenURI(nftItem.nftAddress,nftItem.tokenId);

  

        let tokenURIResponse = await axios.get(tokenURI);

        console.log(tokenURIResponse);
  
        nftData.push({
          marketId: marketIds[i],
          tokenId:nftItem.tokenId,
          nftAddress:nftItem.nftAddress,
          price:this.web3.utils.fromWei(nftItem.price,"ether"),
          sold:nftItem.sold,
          percentMapId:nftItem.PercentMapId,
          tokenImage: tokenURIResponse.data.image,
          tokenName:tokenURIResponse.data.name,
          tokenDescription:tokenURIResponse.data.description
        });


      }

    }
    return nftData;    

  }



  async getNFTDetailById(_marketId){
      
  
        let nftItem = await this.contract.methods
        .markets(_marketId)
        .call();

        console.log(nftItem);
  
        let tokenURI=await this.getTokenURI(nftItem.nftAddress,nftItem.tokenId);

        let tokenURIResponse = await axios.get(tokenURI);
  
  

        return{
          marketId: _marketId,
          tokenId:nftItem.tokenId,
          nftAddress:nftItem.nftAddress,
          price:this.web3.utils.fromWei(nftItem.price,"ether"),
          sold:nftItem.sold,
          percentMapId:nftItem.PercentMapId,
          tokenImage: tokenURIResponse.data.image,
          tokenName:tokenURIResponse.data.name,
          tokenDescription:tokenURIResponse.data.description,
          
        };
      
      
  }





  async getNFTPercent(_marketId){
    let pecentCounts = await this.contract.methods.getPercentCountById(_marketId).call();

   
    var percentData=[];
  
      for(var i=0;i<pecentCounts;i++){
        let percent = await this.contract.methods.PercentMap(_marketId,i).call();

        console.log(percent);

        percentData.push({
          buyer:percent.buyer,
          amount:this.web3.utils.fromWei(percent.amount,"ether"),
          expectedPrice:this.web3.utils.fromWei(percent.expectedPrice,"ether")
        })
      }
    


    return percentData;
  }




  async buyNFTPercent(_marketId, _from, _value, _expectPrice) {

    var result = await this.contract.methods
      .buyPercent(_marketId,_expectPrice)
      .send({ from: _from, value: _value })
      .on("transactionHash", function (hash) {
        console.info(hash);
        // return hash;
      })
      .on("receipt", function (receipt) {
        return receipt;
      });
    return result;
  }


  async getTokenURI(_nftAddress,_tokenId){
    var contract = new this.web3.eth.Contract(
      ERC721["abi"],
      _nftAddress
    );;
    var tokenURI=await contract.methods.tokenURI(_tokenId).call()
    return tokenURI;
  }

 
  async getHistory(_from,_historyType,_pageNum,_pageSize){


    console.log("currentTabValue",_historyType)
    console.log("pageNum",_pageNum)
    console.log("pageSize",_pageSize)



  
    if(_historyType=="sale"){
      var historyIds = await this.contract.methods
      .getSaleNFTs(_pageNum, _pageSize)
      .call({from: _from}).catch((err) => {
        return [];
      });
  
   
    }else{
      var historyIds = await this.contract.methods
      .getBuyNFTs(_pageNum, _pageSize)
      .call({from: _from}).catch((err) => {
        return [];
      });
   
    }
  
   

    let nftData = [];

    for (let i = 0; i < historyIds.length ; i++) {
   
      if(historyIds[i]!=0){
        let nftItem = await this.contract.methods
        .markets(historyIds[i])
        .call();


        let pecentCounts = await this.contract.methods.getPercentCountById(historyIds[i]).call();



        let owners=await this.contract.methods.nftOwner(historyIds[i]).call();
     
  
        let tokenURI=await this.getTokenURI(nftItem.nftAddress,nftItem.tokenId);

        let tokenURIResponse = await axios.get(tokenURI);

        console.log(tokenURIResponse)
  
        nftData.push({
          marketId: historyIds[i],
          tokenId:nftItem.tokenId,
          nftAddress:nftItem.nftAddress,
          price:this.web3.utils.fromWei(nftItem.price,"ether"),
          sold:nftItem.sold,
          percentMapId:nftItem.PercentMapId,
          tokenImage: tokenURIResponse.data.image,
          tokenName:tokenURIResponse.data.name,
          tokenDescription:tokenURIResponse.data.description,
          owners:owners,
          pecentCounts:pecentCounts
        });


      }

    }


    return nftData;

  

  }


  async cancelSale(_marketId,_from){

    console.log(_marketId);
    console.log(_from);

    var result = await this.contract.methods
    .cancelSale(_marketId)
    .send({ from: _from})
    .on("transactionHash", function (hash) {
      console.info(hash);
      // return hash;
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
      return receipt;
     
    });
    return result;
  }



  
}

export default MarketPlace;
