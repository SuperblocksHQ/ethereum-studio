// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['MyContract'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

function Empty(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

Empty.prototype.onReady = function() {
    this.init(function () {
        $('#message').append("DApp loaded successfully.");
    });
}

Empty.prototype.init = function(cb) {
    // We create a new Web3 instance using either the Metamask provider
    // or an independent provider created towards the endpoint configured for the contract.
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
        new Web3.providers.HttpProvider(this.Contract.endpoint));

    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    this.instance = contract_interface.at(this.Contract.address);

    cb();
}

if(typeof(Contracts) === "undefined") var Contracts={ MyContract: { abi: [] }};
var empty = new Empty(Contracts['MyContract']);

$(document).ready(function() {
    empty.onReady();
});
