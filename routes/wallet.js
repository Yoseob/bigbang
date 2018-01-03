var express = require('express');
var lightWallet = require('eth-lightwallet');
var Web3 = require('web3');
var router = express.Router();

var web3 = new Web3('http://localhost:8545');

if(web3 === undefined){
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}


router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/', function (req, res) {
    generate_seed(req.body.password, function (result) {
        res.json(result);
    });
});

//promise에 익숙하지 않아서 일단 콜백으로..
function generate_seed(passWord, cb) {
    var new_seed = lightWallet.keystore.generateRandomSeed();
    if (passWord) {
        generate_addresses(new_seed, passWord, cb);
    }
}


function generate_addresses(seed, pw , cb) {
    console.log(seed);
    if (!lightWallet.keystore.isSeedValid(seed)) {
        console.log("Please enter a valid seed");
        return;
    }

    var totalAddresses = 1;

    if (!Number.isInteger(parseInt(totalAddresses))) {
        console.log("Please enter valid number of addresses");
        return;
    }

    if (!pw) {
        pw = Math.random().toString();
    }
    console.log("pw : " + pw);

    lightWallet.keystore.createVault({
        password: pw,
        seedPhrase: seed,
        hdPathString: "m/0'/0'/0'"
    }, function (err, ks) {
        console.log("ks : " + ks.toString());
        ks.keyFromPassword(pw, function (err, pwDerivedKey) {
            if (err) {
                console.log(err);
            } else {
                ks.generateNewAddress(pwDerivedKey, totalAddresses);
                var addresses = ks.getAddresses();


                for (var count = 0; count < addresses.length; count++) {
                    var address = addresses[count];
                    var private_key = ks.exportPrivateKey(address, pwDerivedKey);
                    var balance = web3.eth.getBalance(address);
                    cb({
                            "address" : address ,
                            "privateKey" : private_key,
                            "balance" : balance,
                            "keyStore": ks
                    });
                }
            }
        });
    });
}

module.exports = router;
