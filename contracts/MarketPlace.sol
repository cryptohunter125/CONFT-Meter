// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "./DateTime.sol";
contract MarketPlace{
    uint[] NFTArray;
    mapping(uint=>NFTItem) public markets;
    mapping(uint=>UserPercent[]) public PercentMap;
    mapping(address=>uint[]) private BuyNFTsHistory;
    mapping(address=>uint[]) private SaleNFTsHistory;

    struct UserPercent{
        address buyer;
        uint amount;
        uint expectedPrice;
    }    
    
    
    using Counters for Counters.Counter;
    Counters.Counter private _marketIds;
    struct NFTItem{
        address nftAddress;
        uint tokenId;
        uint price;
        address[] owners;
        uint timestamp;
        uint sold;
        uint PercentMapId;
    }

    event AddEvent(uint marketId,address nftAddress,uint tokenId,uint price,address[] owners,uint timestamp,uint sold,uint PercentMapId);
    event TransferEvent(address buyer,uint amount);


    function addNFTtoMarket(address _contractAddress,uint _price,uint _tokenId)public{
        _marketIds.increment();
        address[] memory owners=new address[](1);
        owners[0]=msg.sender;
        NFTItem memory nft=NFTItem(_contractAddress,_tokenId,_price,owners,block.timestamp,0,0);
        uint marketId=_marketIds.current();
        markets[marketId]=nft;
        NFTArray.push(marketId);
        ERC721 erc721=ERC721(_contractAddress);
        erc721.transferFrom(msg.sender,address(this),_tokenId);
        addSaleNFTHistory(marketId);
        emit AddEvent(marketId,_contractAddress,_tokenId,_price,owners,block.timestamp,0,0);
    }

    function getPercentCountById(uint _marketId)public view returns(uint){
        UserPercent[] memory percentArray=PercentMap[_marketId];
        return percentArray.length;
    }
    



    function buyPercent(uint _marketId,uint _expectedPrice) public payable {
       

       
        NFTItem memory nftItem=markets[_marketId];
        uint price=nftItem.price;

      
        require(nftItem.sold==0);

       
        require(msg.value>=price/10);

        uint total=0;
       
        for(uint i=0;i<PercentMap[_marketId].length;i++){
            total=total+PercentMap[_marketId][i].amount;
        }
 
        uint remaining=price-total;
        require(msg.value<=remaining&&msg.value>0);

    
        PercentMap[_marketId].push(UserPercent(msg.sender,msg.value,_expectedPrice));


        addBuyNFTHistory(_marketId);
        
        if((remaining-msg.value)==0){
           
      
            if(nftItem.PercentMapId==0){
        
                payable(nftItem.owners[0]).transfer(price);
            }else{
             
                UserPercent[] memory UserPercentArray=PercentMap[nftItem.PercentMapId];
           
                uint prePrice=markets[nftItem.PercentMapId].price;

                
                for(uint i=0;i<UserPercentArray.length;i++){
                    

                    uint mulResult=SafeMath.mul(price,UserPercentArray[i].amount);
                    uint transferAmount=SafeMath.div(mulResult,prePrice);
                    
                    payable(UserPercentArray[i].buyer).transfer(transferAmount);
                    emit TransferEvent(UserPercentArray[i].buyer,transferAmount);

                }
                
         
            }
        
            nftItem.sold=1;
            markets[_marketId]=nftItem;


       
            
            address[] memory owners=new address[](PercentMap[_marketId].length);
            uint totalExpectedPrice=0;
            
            for(uint i=0;i<PercentMap[_marketId].length;i++){
                
                owners[i]=PercentMap[_marketId][i].buyer;
                totalExpectedPrice = totalExpectedPrice+PercentMap[_marketId][i].expectedPrice;
            }
            uint newPrice=SafeMath.div(totalExpectedPrice,PercentMap[_marketId].length);

            reSale(nftItem.nftAddress,nftItem.tokenId,newPrice,owners,_marketId);
            


        }

     
    }

    function reSale(address _contractAddress,uint _tokenId,uint _price,address[] memory _owners,uint _percentMapId)private{
        NFTItem memory nft=NFTItem(_contractAddress,_tokenId,_price,_owners,block.timestamp,0,_percentMapId);
        _marketIds.increment();
        uint marketId=_marketIds.current();
        markets[marketId]=nft;
        NFTArray.push(marketId);
        addSaleNFTHistory(marketId);
       
    }


    function addBuyNFTHistory(uint marketId)private{
        uint[] memory nftMarketIds=BuyNFTsHistory[msg.sender];
        if(nftMarketIds.length==0){
            uint[1] memory newNFTMarketIds=[marketId];
            BuyNFTsHistory[msg.sender]=newNFTMarketIds;
        }else{
            uint nftMarketIdsLength=nftMarketIds.length+1;
            uint[] memory newNFTMarketIds=new uint[](nftMarketIdsLength);
            for(uint i=0;i<newNFTMarketIds.length;i++){
                if(i==newNFTMarketIds.length-1){
                     newNFTMarketIds[i]=marketId;
                }else{
                    newNFTMarketIds[i]=nftMarketIds[i];
                }
                
            }
            BuyNFTsHistory[msg.sender]=newNFTMarketIds;
        }
    }

    function addSaleNFTHistory(uint marketId)private{
        uint[] memory nftMarketIds=SaleNFTsHistory[msg.sender];
        if(nftMarketIds.length==0){
            uint[1] memory newNFTMarketIds=[marketId];
            SaleNFTsHistory[msg.sender]=newNFTMarketIds;
        }else{
            uint nftMarketIdsLength=nftMarketIds.length+1;
            uint[] memory newNFTMarketIds=new uint[](nftMarketIdsLength);
            for(uint i=0;i<newNFTMarketIds.length;i++){
                if(i==newNFTMarketIds.length-1){
                     newNFTMarketIds[i]=marketId;
                }else{
                    newNFTMarketIds[i]=nftMarketIds[i];
                }
                
            }
            SaleNFTsHistory[msg.sender]=newNFTMarketIds;
        }
    }

 

    function nftOwner(uint _marketId)public view returns(address[] memory){
        address[] memory owners= markets[_marketId].owners;
        return owners;
    }
    
    function cancelSale(uint _marketId)public {
        NFTItem memory nft=markets[_marketId];
        address[] memory owners= nft.owners;
        require(msg.sender==owners[0]&&owners.length==1);
        require(PercentMap[_marketId].length==0);
        ERC721 erc721=ERC721(nft.nftAddress);
        erc721.transferFrom(address(this),msg.sender,nft.tokenId);
        nft.sold=2;
        markets[_marketId]=nft;
    }

    


    function getNFTs(uint _pageNum,uint _pageSize)public view returns(uint [] memory){
        return getDataByPage(NFTArray,_pageNum, _pageSize);
    }

    function getBuyNFTs(uint _pageNum,uint _pageSize)public view returns(uint [] memory){
        uint[] memory MyBuyNFTsHistoryArray =BuyNFTsHistory[msg.sender];
     
        return getDataByPage(MyBuyNFTsHistoryArray,_pageNum, _pageSize);
        
        
    }

    function getSaleNFTs(uint _pageNum,uint _pageSize)public view returns(uint [] memory){
        uint[] memory MySaleNFTsHistoryArray =SaleNFTsHistory[msg.sender];
       
        return getDataByPage(MySaleNFTsHistoryArray,_pageNum, _pageSize);
    }

    function getDataByPage(uint[] memory _array,uint _pageNum,uint _pageSize)private pure returns(uint[] memory){
        uint[] memory returnArray=new uint[](_pageSize);
        uint arrayIndex=0;
 
        uint dataStart=(_array.length-1) - (_pageNum-1) * _pageSize;
        uint dataEnd;
        
        if(dataStart<_pageSize){
            dataEnd=0;
        }else{
            dataEnd=dataStart-_pageSize+1;
        }

        for(int i=int(dataStart);i>=int(dataEnd);i--){
            returnArray[arrayIndex]=_array[uint(i)];
            arrayIndex++;
        }
        return returnArray;
    }




    function toString(uint256 value) internal pure returns (string memory) {
  
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }



    




}