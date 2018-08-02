// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

export default class Templates {
    static tplRaiseToSummon(project, title) {
        const data={
    "files": {
        "/": {
            "type": "d",
            "children": {
                "app": {
                    "type": "d",
                    "children": {
                        "app.html": {
                            "type": "f",
                            "contents": "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/jquery@3.3.1/dist/jquery.js\"></script>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/web3@0.20.5/dist/web3.min.js\"></script>\n        <!-- JAVASCRIPT -->\n        <!-- STYLE -->\n    </head>\n    <body>\n        <div class=\"heading\">\n                <h1>Raise Funds to Summon Nick Johnson to The Decentralized Camp</h1>\n        </div>\n        <div>\n            <div class=\"main\">\n                <div class=\"loading\">\n                    <h2>loading...</h2>\n                </div>\n                <div class=\"error\">\n                    <h2>Could not call contract.</h2>\n                </div>\n                <div class=\"noinit\">\n                    <h2>The contract has not been initiated by the receiver, yet.</h2>\n                </div>\n                <div class=\"nometamask\">\n                    <span>Metamask is not found. If you have <a href=\"https://metamask.io\">Metamask</a> installed then you can donate directly from here.</span>\n                </div>\n                <div class=\"lockedmetamask\">\n                    <span>Metamask is found but it seems to be locked. Unlock Metamask and then reload the page.</span>\n                </div>\n                <div class=\"cancelled\">\n                    <span>The donation was cancelled.</span>\n                </div>\n                <div class=\"thanks\">\n                    <span>Thank you for your donation!</span>\n                </div>\n                <div class=\"donate\">\n                    <span>Wei to donate: <input type=\"text\" value=\"1\" id=\"donation_value\" /></span><br />\n                    <button id=\"donatebtn\" type=\"submit\">Donate using Metamask</button>\n                </div>\n            </div>\n        </div>\n    </body>\n</html>"
                        },
                        "app.css": {
                            "type": "f",
                            "contents": "body {\n    background-color: steelblue;\n    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;\n}\n\n.heading {\n    display: block;\n    background-color: antiquewhite;\n    border-radius: 10px;\n    padding: 10px;\n    color: #333;\n    text-align: center;\n}\n\n.main {\n    margin-top: 40px;\n    display: block;\n    text-align: center;\n    font-size: 1.3em;\n    color: #eee;\n}\n\nbutton {\n    background-color: darkkhaki;\n    padding: 10px;\n    color: green;\n    font-size: 1.3em;\n}\n\n.nometamask, .donate, .lockedmetamask, .error, .noinit, .thanks, .cancelled {\n    display: none;\n}"
                        },
                        "app.js": {
                            "type": "f",
                            "contents": "(function () {\n    var web3;\n    var instance;\n\n    this.gotWeb3 = function () {\n        if (window.web3.eth.accounts.length == 0) {\n            $(\".loading\").hide();\n            $(\".lockedmetamask\").show();\n            return false;\n        }\n        $(\".lockedmetamask\").hide();\n\n        web3 = new Web3(window.web3.currentProvider);\n        var abi = Contracts['RaiseToSummon'].abi;\n        var address = Contracts['RaiseToSummon'].address;\n        var contract_interface = web3.eth.contract(abi);\n        instance = contract_interface.at(address);\n        instance.minimumAmountRequired(function (error, result) {\n            $(\".loading\").hide();\n            if (error) {\n                $(\".error\").show();\n                return;\n            }\n            else {\n                var minimumAmount = result.toNumber();\n                console.log(minimumAmount);\n                if (minimumAmount == 0) {\n                    $(\".noinit\").show();\n                    return;\n                }\n            }\n            $(\"#donatebtn\").click(() => {\n                donate();\n            });\n            $(\".donate\").show();\n        });\n    }\n\n    this.donate = function () {\n        var value = parseInt(document.getElementById(\"donation_value\").value);\n        if(isNaN(value) || value < 1) {\n            alert(\"Please enter a valid value of wei to donate.\");\n            return;\n        }\n        $(\".donate\").hide();\n        $(\".loading\").show();\n        instance.donate({ from: this.web3.eth.accounts[0], value: value, gas: \"99000\", gasPrice: '33000000000' },\n            (error, result) => {\n                $(\".loading\").hide();\n                if (result != null) {\n                    console.log(\"Result: \" + result);\n                    $(\".thanks\").show();\n                } else {\n                    console.log(\"Error: \" + error);\n                    $(\".cancelled\").show();\n                }\n            });\n    };\n\n    function lackingWeb3() {\n        $(\".loading\").hide();\n        $(\".nometamask\").show();\n    }\n\n    $(document).ready(function () {\n        if (typeof window.web3 !== 'undefined' && window.web3.currentProvider) {\n            const check=()=>{\n                if(gotWeb3()===false) {\n                    // We keep trying since Metamask populates the accounts list\n                    // after the page has been loaded.\n                    setTimeout(check, 1000);\n                }\n            };\n            check();\n        } else {\n            lackingWeb3();\n        }\n    });\n})();"
                        }
                    }
                },
                "contracts": {
                    "type": "d",
                    "children": {
                        "Articles.sol": {
                            "type": "f",
                            "contents": "/*\n    Created by Blockie and The Decentralized Camp to summon Nick Johnson to Stockholm for a meetup.\n*/\npragma solidity ^0.4.17;\n\ncontract RaiseToSummon {\n\n    // Base definitions\n    address public owner;\n    address public receiver;\n    string public cause;\n    uint256 public expirationInSeconds;\n    bool public hasBeenClaimed;\n    uint256 public timeStarted;\n\n    // Dynamic data\n    uint256 public minimumAmountRequired;\n    uint256 public numPayments;\n    uint256 public totalAmountRaised;\n    mapping(address => uint256) donationData;\n\n    function RaiseToSummon(address beneficiary, string message, uint256 secondsUntilExpiration)\n        public\n    {\n        require(beneficiary != 0x0);\n        require(secondsUntilExpiration > 0);\n\n        owner = msg.sender;\n        receiver = beneficiary;\n        cause = message;\n        expirationInSeconds = secondsUntilExpiration;\n        hasBeenClaimed = false;\n\n        minimumAmountRequired = 0;\n        numPayments = 0;\n        totalAmountRaised = 0;\n        timeStarted = block.timestamp;\n    }\n\n    function ()\n        public\n    {\n        revert();\n    }\n\n    function donate()\n        public\n        payable\n    {\n        require(msg.sender != receiver);\n        require(block.timestamp < (timeStarted + expirationInSeconds));\n        require(msg.value > 0);\n        require(minimumAmountRequired != 0);\n        require(hasBeenClaimed == false);\n\n        assert(donationData[msg.sender] + msg.value >= donationData[msg.sender]);\n        assert(totalAmountRaised + msg.value >= totalAmountRaised);\n        assert(numPayments + 1 >= numPayments);\n\n        donationData[msg.sender] += msg.value;\n        totalAmountRaised += msg.value;\n        numPayments += 1;\n    }\n\n    // Note: can only be set once\n    function receiverSetAmountRequired(uint256 minimum)\n        public\n    {\n        require(msg.sender == receiver);\n        require(minimumAmountRequired == 0);\n        require(minimum > 0);\n\n        minimumAmountRequired = minimum;\n    }\n\n    function receiverWithdraw()\n        public\n    {\n        require(msg.sender == receiver);\n        require(totalAmountRaised >= minimumAmountRequired);\n        require(this.balance > 0);\n        require(block.timestamp < (timeStarted + expirationInSeconds));\n        require(hasBeenClaimed == false);\n\n        hasBeenClaimed = true;\n        receiver.transfer(this.balance);\n        // Expecting transfer to throw on error\n        // assert(this.balance == 0);\n    }\n\n    function withdraw()\n        public\n    {\n        require(donationData[msg.sender] > 0);\n        require(block.timestamp > (timeStarted + expirationInSeconds));\n        require(hasBeenClaimed == false);\n\n        var value = donationData[msg.sender];\n        donationData[msg.sender] = 0;\n        msg.sender.transfer(value);\n        // Expecting transfer to throw on error\n        // assert(donationData[donor] == 0);\n    }\n\n    function currentTotalExcess()\n        public\n        constant returns (uint256)\n    {\n        if (totalAmountRaised > minimumAmountRequired) {\n            return totalAmountRaised - minimumAmountRequired;\n        }\n        else {\n            return 0;\n        }\n    }\n\n    function expirationTimestamp()\n        public\n        constant returns (uint256)\n    {\n        assert((timeStarted + expirationInSeconds) >= timeStarted);\n        return (timeStarted + expirationInSeconds);\n    }\n}"
                        }
                    }
                }
            }
        }
    },
    "dappfile": {
        "environments": [
            {
                "name": "browser"
            },
            {
                "name": "local"
            },
            {
                "name": "test"
            },
            {
                "name": "main"
            }
        ],
        "constants": [],
        "contracts": [
            {
                "_environments": [
                    {
                        "name": "local",
                        "data": {
                            "network": "local"
                        }
                    }
                ],
                "source": "/contracts/Articles.sol",
                "args": [
                    {
                        "account": "USER1"
                    },
                    {
                        "value": "Summon Nick Johnson"
                    },
                    {
                        "value": "604800"
                    }
                ],
                "account": "DEPLOY",
                "blockchain": "ethereum",
                "name": "RaiseToSummon",
                "network": "browser"
            }
        ],
        "wallets": [
            {
                "desc": "This is a wallet for local development",
                "name": "development",
                "blockchain": "ethereum"
            },
            {
                "desc": "A private wallet",
                "name": "private",
                "blockchain": "ethereum"
            },
            {
                "desc": "External wallet integrating with Metamask and other compatible wallets",
                "name": "external",
                "blockchain": "ethereum",
                "type": "external"
            }
        ],
        "accounts": [
            {
                "name": "DEPLOY",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "0"
            },
            {
                "name": "USER1",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "1"
            },
            {
                "name": "USER2",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "2"
            },
            {
                "name": "USER3",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "3"
            },
            {
                "name": "EXTERNAL",
                "blockchain": "ethereum",
                "wallet": "external",
                "index": "0"
            }
        ],
        "project": {
            info: {title: title}
        }
    }
};
        return [data.dappfile,data.files];
    }

    static tplNewsFeed(project, title) {
        const data={
    "files": {
        "/": {
            "type": "d",
            "children": {
                "app": {
                    "type": "d",
                    "children": {
                        "app.html": {
                            "type": "f",
                            "contents": "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/jquery@3.3.1/dist/jquery.js\"></script>\n        <script src=\"https://unpkg.com/web3@0.20.5/dist/web3.min.js\"></script>\n        <!-- JAVASCRIPT -->\n        <!-- STYLE -->\n    </head>\n    <body>\n        <h1 style=\"text-align: center;\"><span style=\"background-color:#111;color:#fff;\">YOUR CENSORSHIP RESISTANT NEWSFEED</span></h1>\n        <br/>\n\n        <div id=\"articles\">\n        </div>\n    </body>\n</html>\n"
                        },
                        "app.css": {
                            "type": "f",
                            "contents": "body {\n    background-color: firebrick;\n    font-size: 1.3em;\n    text-align: center;\n    color: darkslategray;\n}\n.aha {\n    margin: 10px;\n    display: block;\n    background-color: #111;\n}\n.aha h3 {\n    text-align: center;\n    margin: 10px;\n    color: red;\n    font-size: 33px;\n\n}\n.aha a {\n    margin: 10px;\n    font-size: 23px;\n    color: #fef0f0;\n}\n"
                        },
                        "app.js": {
                            "type": "f",
                            "contents": "(function (Contract) {\n    var web3;\n    var instance;\n\n    function init(cb) {\n        web3 = new Web3(\n            (window.web3 && window.web3.currentProvider) ||\n            new Web3.providers.HttpProvider(Contract.endpoint));\n\n        var contract_interface = web3.eth.contract(Contract.abi);\n        instance = contract_interface.at(Contract.address);\n        cb();\n    }\n\n    function getNumArticles(cb) {\n        instance.numArticles(function (error, result) {\n            if (error) {\n                console.error(error);\n                cb(0);\n                return;\n            }\n            cb(result.toNumber());\n        });\n    }\n\n    function getArticle(index, cb) {\n        instance.getArticle(index, function (error, result) {\n                        console.log(result);\n\n            cb(error, result);\n        });\n    }\n\n    $(document).ready(function () {\n        init(function () {\n            getNumArticles(function (nrArticles) {\n                console.log(\"Number of articles: \" + nrArticles);\n                if (nrArticles == 0) {\n                    $('#articles').append(\n                        \"<div class='aha'><h3>No articles here yet.. Try reloading in a while.</h3>\"\n                    );\n                }\n                else {\n                    var fn = function (index) {\n                        if (index < 0) {\n                            return;\n                        }\n                        getArticle(index, function (error, result) {\n                            if (error) {\n                                console.error(\"Could not get article:\", error);\n                                return;\n                            }\n                            $('#articles').append(\n                                \"<div class='aha'><h3>\" + result[0] + \"</h3>\" +\n                                \"<a target='_blank' href='\" + result[1] + \"'>\" + result[1] + \"</a></div>\"\n                            );\n                            fn(index - 1);\n                        });\n\n                    }\n                    fn(nrArticles - 1);\n                }\n            });\n        });\n    });\n})(Contracts['Articles']);"
                        }
                    }
                },
                "contracts": {
                    "type": "d",
                    "children": {
                        "Articles.sol": {
                            "type": "f",
                            "contents": "pragma solidity ^0.4.17;\n\ncontract Articles {\n    address public owner;\n    address public author;\n    uint256 public numArticles;\n\n    struct Article {\n        string title;\n        string hash;\n    }\n\n    Article[] articles;\n\n    function Articles(address givenAuthor)\n        public\n    {\n        require(givenAuthor != 0x0);\n        owner = msg.sender;\n        author = givenAuthor;\n    }\n\n    function publish(string title, string hash)\n        public\n    {\n        require(msg.sender == author);\n\n        Article memory article = Article(\n            title,\n            hash\n        );\n        articles.push(article);\n        numArticles += 1;\n    }\n\n    function getArticle(uint256 index)\n        public\n        constant returns (string, string)\n    {\n        return (articles[index].title, articles[index].hash);\n    }\n}\n"
                        }
                    }
                }
            }
        }
    },
    "dappfile": {
        "environments": [
            {
                "name": "browser"
            },
            {
                "name": "local"
            },
            {
                "name": "test"
            },
            {
                "name": "main"
            }
        ],
        "constants": [],
        "contracts": [
            {
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "network": "browser"
                        }
                    },
                    {
                        "name": "local",
                        "data": {
                            "network": "local"
                        }
                    }
                ],
                "source": "/contracts/Articles.sol",
                "args": [
                    {
                        "account": "USER1"
                    }
                ],
                "account": "DEPLOY",
                "blockchain": "ethereum",
                "name": "Articles",
                "js": {
                    "export": [
                        {
                            "type": "abi"
                        },
                        {
                            "type": "account"
                        },
                        {
                            "type": "account_address"
                        },
                        {
                            "type": "address"
                        }
                    ]
                },
                "network": "browser"
            },
        ],
        "wallets": [
            {
                "desc": "This is a wallet for local development",
                "name": "development",
                "blockchain": "ethereum"
            },
            {
                "desc": "A private wallet",
                "name": "private",
                "blockchain": "ethereum"
            },
            {
                "desc": "External wallet integrating with Metamask and other compatible wallets",
                "name": "external",
                "blockchain": "ethereum",
                "type": "external"
            }
        ],
        "accounts": [
            {
                "name": "DEPLOY",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "0"
            },
            {
                "name": "USER1",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "1"
            },
            {
                "name": "USER2",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "2"
            },
            {
                "name": "USER3",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "3"
            },
            {
                "name": "EXTERNAL",
                "blockchain": "ethereum",
                "wallet": "external",
                "index": "0"
            }
        ],
        "project": {
            info: {title: title}
        }
    }
};
        return [data.dappfile,data.files];
    }

    static tplHelloWorld(project, title) {
        const data={
            "files": {
                "/": {
                    "type": "d",
                    "children": {
                        "app": {
                            "type": "d",
                            "children": {
                                "app.html": {
                                    "type": "f",
                                    "contents": "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/jquery@3.3.1/dist/jquery.js\"></script>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/web3@0.20.5/dist/web3.min.js\"></script>\n        <!-- JAVASCRIPT -->\n        <!-- STYLE -->\n    </head>\n    <body>\n        <h1>Hello World DApp</h1>\n        <h2>Message: <span id=\"message\"></span></h2>\n    </body>\n</html>"
                                },
                                "app.css": {
                                    "type": "f",
                                    "contents": "body {\n    background-color: midnightblue;\n    color: darksalmon;\n    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;\n    text-align: center;\n}"
                                },
                                "app.js": {
                                    "type": "f",
                                    "contents": "(function (Contract) {\n    var web3;\n    var instance;\n\n    function init(cb) {\n        web3 = new Web3(\n            (window.web3 && window.web3.currentProvider) ||\n            new Web3.providers.HttpProvider(Contract.endpoint));\n\n        var contract_interface = web3.eth.contract(Contract.abi);\n        instance = contract_interface.at(Contract.address);\n        cb();\n    }\n\n    function getMessage(cb) {\n        instance.message(function (error, result) {\n            cb(error, result);\n        });\n    }\n\n    $(document).ready(function () {\n        init(function () {\n            getMessage(function (error, result) {\n                if (error) {\n                    console.error(\"Could not get article:\", error);\n                    return;\n                }\n                $('#message').append(result);\n            });\n        });\n    });\n})(Contracts['HelloWorld']);"
                                },
                                "contracts": {
                                    "type": "d",
                                    "children": {}
                                }
                            }
                        },
                        "contracts": {
                            "type": "d",
                            "children": {
                                "HelloWorld.sol": {
                                    "type": "f",
                                    "contents": "pragma solidity ^0.4.17;\n\ncontract HelloWorld {\n    string public message;\n    \n    function HelloWorld(string message2) public {\n        message=message2;\n    }\n\n    function update(string message2) public {\n        message=message2;\n    }\n}"
                                },
                            }
                        }
                    }
                }
            },
    "dappfile": {
        "environments": [
            {
                "name": "browser"
            },
            {
                "name": "local"
            },
            {
                "name": "test"
            },
            {
                "name": "main"
            }
        ],
        "constants": [],
        "contracts": [
            {
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "network": "browser"
                        }
                    },
                    {
                        "name": "local",
                        "data": {
                            "network": "local"
                        }
                    }
                ],
                "network": "browser",
                "source": "/contracts/HelloWorld.sol",
                "args": [
                    {
                        "value": "Hello World!"
                    }
                ],
                "account": "DEPLOY",
                "blockchain": "ethereum",
                "name": "HelloWorld"
            },
        ],
        "wallets": [
            {
                "desc": "This is a wallet for local development",
                "name": "development",
                "blockchain": "ethereum"
            },
            {
                "desc": "A private wallet",
                "name": "private",
                "blockchain": "ethereum"
            },
            {
                "desc": "External wallet integrating with Metamask and other compatible wallets",
                "name": "external",
                "blockchain": "ethereum",
                "type": "external"
            }
        ],
        "accounts": [
            {
                "name": "DEPLOY",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "0"
            },
            {
                "name": "USER1",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "1"
            },
            {
                "name": "USER2",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "2"
            },
            {
                "name": "USER3",
                "blockchain": "ethereum",
                "wallet": "development",
                "index": "3"
            },
            {
                "name": "EXTERNAL",
                "blockchain": "ethereum",
                "wallet": "external",
                "index": "0"
            }
        ],
        "project": {
            info: {title: title}
            }
        }
    };
        return [data.dappfile,data.files];
    }

    static tplBlank(project, title) {
        const data={
            "files": {
                "/": {
                    "type": "d",
                    "children": {
                        "app": {
                            "type": "d",
                            "children": {
                                "app.html": {
                                    "type": "f",
                                    "contents": "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/jquery@3.3.1/dist/jquery.js\"></script>\n        <script type=\"text/javascript\" src=\"https://unpkg.com/web3@0.20.5/dist/web3.min.js\"></script>\n        <!-- JAVASCRIPT -->\n        <!-- STYLE -->\n    </head>\n    <body>\n        <h1>Hello World DApp</h1>\n        <h2>Message: <span id=\"message\"></span></h2>\n    </body>\n</html>"
                                },
                                "app.css": {
                                    "type": "f",
                                    "contents": "body {\n    background-color: midnightblue;\n    color: darksalmon;\n    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;\n    text-align: center;\n}"
                                },
                                "app.js": {
                                    "type": "f",
                                    "contents": "(function (Contract) {\n    var web3;\n    var instance;\n\n    function init(cb) {\n        web3 = new Web3(\n            (window.web3 && window.web3.currentProvider) ||\n            new Web3.providers.HttpProvider(Contract.endpoint));\n\n        var contract_interface = web3.eth.contract(Contract.abi);\n        instance = contract_interface.at(Contract.address);\n        cb();\n    }\n\n    function getMessage(cb) {\n        instance.message(function (error, result) {\n            cb(error, result);\n        });\n    }\n\n    $(document).ready(function () {\n        init(function () {\n            getMessage(function (error, result) {\n                if (error) {\n                    console.error(\"Could not get article:\", error);\n                    return;\n                }\n                $('#message').append(result);\n            });\n        });\n    });\n})(Contracts['HelloWorld']);"
                                },
                                "contracts": {
                                    "type": "d",
                                    "children": {}
                                }
                            }
                        },
                        "contracts": {
                            "type": "d",
                            "children": {
                                "HelloWorld.sol": {
                                    "type": "f",
                                    "contents": "pragma solidity ^0.4.17;\n\ncontract HelloWorld {\n    string public message;\n    \n    function HelloWorld(string message2) public {\n        message=message2;\n    }\n\n    function update(string message2) public {\n        message=message2;\n    }\n}"
                                },
                            }
                        }
                    }
                }
            },
    "dappfile": {
        "environments": [
            {
                "name": "browser"
            },
            {
                "name": "custom"
            },
            {
                "name": "rinkeby"
            },
            {
                "name": "ropsten"
            },
            {
                "name": "kovan"
            },
            {
                "name": "infuranet"
            },
            {
                "name": "mainnet"
            }
        ],
        "constants": [],
        "contracts": [
            {
                "source": "/contracts/HelloWorld.sol",
                "args": [
                    {
                        "value": "Hello World!"
                    }
                ],
                "blockchain": "ethereum",
                "name": "HelloWorld"
            },
        ],
        "wallets": [
            {
                "desc": "This is a wallet for local development",
                "name": "development",
                "blockchain": "ethereum"
            },
            {
                "desc": "A private wallet",
                "name": "private",
                "blockchain": "ethereum"
            },
            {
                "desc": "External wallet integrating with Metamask and other compatible wallets",
                "name": "external",
                "blockchain": "ethereum",
                "type": "external"
            }
        ],
        "accounts": [
            {
                "name": "ACCOUNT0",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 0,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 0,
                        }
                    },
                    {
                        "name": "rinkeby",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "ropsten",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "kovan",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "infuranet",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "mainnet",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                ],
            },
            {
                "name": "ACCOUNT1",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 1,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 1,
                        }
                    },
                ],
                "address": "0x0"
            },
            {
                "name": "ACCOUNT2",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 2,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 2,
                        }
                    },
                ],
                "address": "0x0"
            },
            {
                "name": "ACCOUNT3",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 3,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 3,
                        }
                    },
                ],
                "address": "0x0"
            },
            {
                "name": "ACCOUNT4",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 4,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 4,
                        }
                    },
                ],
                "address": "0x0"
            },
            {
                "name": "ACCOUNT5",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 5,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 5,
                        }
                    },
                ],
                "address": "0x0"
            },
        ],
        "project": {
            info: {title: title}
            }
        }
    };
        return [data.dappfile,data.files];
    }
}
