var express = require('express');
var router = express.Router();
var Web3 = require('web3');

var lightwallet = require('eth-lightwallet');

var web3 = new Web3('http://localhost:8545');

if(web3 === undefined){
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

/**
 *
 * get 방식으로 이더 전송 테스트 코드
 *
 *
* */
router.get('/', function(req, res) {
    var BN = web3.utils.BN;

    var from = '0xc2666d4d3ebc2431dcd75fbf0938c52a72efa979';
    var to = '0xf4ca9e163c28994a706cbb47a0faa61fe8378d61';
    var value = web3.utils.toWei('0.2', "ether");

    web3.eth.sendTransaction({
        from: from,
        to: to,
        value: value,
        gas: 21000
    }, function (error, result) {
        console.log(result);
        console.log(error);
        if (error) {
            console.log(error);
            res.json(error);
        }
        else {
            console.log(result);
            res.json(result);
        }
    })
});

module.exports = router;
