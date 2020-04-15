// The object 'Contracts' is injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['HelloWorld'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

// Create an instance of the smart contract, passing it as a property,
// which allows web3js to interact with it.
function HelloWorld(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

// Initialize the `HelloWorld` object and create an instance of the web3js library,
HelloWorld.prototype.init = function() {
    // The initialization function defines the interface for the contract using
    // the web3js contract object and then defines the address of the instance
    // of the contract for the `HelloWorld` object.

    // Create a new Web3 instance using either the Metamask provider
    // or an independent provider created as the endpoint configured for the contract.
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(this.Contract.endpoint)
    );

    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    this.instance = this.Contract.address
        ? contract_interface.at(this.Contract.address)
        : { message: () => {} };
};

// Gets the message value stored on the instance of the contract.
HelloWorld.prototype.getMessage = function(cb) {
    this.instance.message(function(error, result) {
        cb(error, result);
    });
};

// Updates the message value on the instance of the contract.
HelloWorld.prototype.setMessage = function() {
    var that = this;
    var msg = $("#message-input").val();
    this.showLoader(true);

    // Set message using the public update function of the smart contract
    this.instance.update(
        msg,
        {
            from: window.web3.eth.accounts[0],
            gas: 100000,
            gasPrice: 100000,
            gasLimit: 100000
        },
        function(error, txHash) {
            // If there's an error, log it
            if (error) {
                console.log(error);
                that.showLoader(false);
            }
            // If success, then wait for confirmation of transaction
            // with utility function and clear form values while waiting
            else {
                that.waitForReceipt(txHash, function(receipt) {
                    that.showLoader(false);
                    if (receipt.status) {
                        console.log({ receipt });
                        $("#message-input").val("");
                    } else {
                        console.log("error");
                    }
                });
            }
        }
    );
};

// Waits for receipt of transaction
HelloWorld.prototype.waitForReceipt = function(hash, cb) {
    var that = this;

    // Checks for transaction receipt using web3 library method
    this.web3.eth.getTransactionReceipt(hash, function(err, receipt) {
        if (err) {
            error(err);
        }
        if (receipt !== null) {
            // Transaction went through
            if (cb) {
                cb(receipt);
            }
        } else {
            // Try again in 2 second
            window.setTimeout(function() {
                that.waitForReceipt(hash, cb);
            }, 2000);
        }
    });
};

// Gets the block number by using the web3js `getBlockNumber` function to return
// the value of the latest block in the configured endpoint.
HelloWorld.prototype.getBlockNumber = function(cb) {
    this.web3.eth.getBlockNumber(function(error, result) {
        cb(error, result);
    });
};

// Hide or show the loader when performing async operations
HelloWorld.prototype.showLoader = function(show) {
    document.getElementById("loader").style.display = show ? "block" : "none";
    document.getElementById("message-button").style.display = show ? "none" : "block";
}

// Calls the functions `getMessage` and `getBlockNumber` defined above, then
// sets the DOM element texts to the values they return or displays an error message
HelloWorld.prototype.updateDisplay = function() {
    var that = this;
    this.getMessage(function(error, result) {
        if (error) {
            $(".error").show();
            return;
        }
        $("#message").text(result);

        that.getBlockNumber(function(error, result) {
            if (error) {
                $(".error").show();
                return;
            }
            $("#blocknumber").text(result);
            setTimeout(function() {
                that.updateDisplay();
            }, 1000);
        });
    });
};

// Bind setMessage function to the button defined in app.html
HelloWorld.prototype.bindButton = function() {
    var that = this;

    $(document).on("click", "#message-button", function() {
        that.setMessage();
    });
};

// JavaScript boilerplate to create the instance of the `HelloWorld` object
// defined above, and show the HTML elements on the page:
HelloWorld.prototype.main = function() {
    $(".blocknumber").show();
    $(".message").show();
    this.updateDisplay();
};

HelloWorld.prototype.onReady = function() {
    this.init();
    this.bindButton();
    this.main();
};

if (typeof Contracts === "undefined")
    var Contracts = { HelloWorld: { abi: [] } };
var helloWorld = new HelloWorld(Contracts["HelloWorld"]);

$(document).ready(function() {
    helloWorld.onReady();
});
