    function getPercentById(uint _marketId)public view returns(string[] memory){
        UserPercent[] memory percentArray=PercentMap[_marketId];
        string[] memory strArray=new string[](percentArray.length);
        for(uint i=0;i<percentArray.length;i++){
            string memory item = string(abi.encodePacked(percentArray[i].buyer,",",toString(percentArray[i].amount),",",toString(percentArray[i].expectedPrice)));
            strArray[i]=item;
        }
        return strArray;
    }