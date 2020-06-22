// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['CryptoPizza'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

function Pizza(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

// Initializes the `Pizza` object and creates an instance of the web3.js library,
Pizza.prototype.init = function() {
    // Creates a new Web3 instance using a provider
    // Learn more: https://web3js.readthedocs.io/en/v1.2.0/web3.html
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(this.Contract.endpoint)
    );

    // Creates the contract interface using the web3.js contract object
    // Learn more: https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#new-contract
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Defines the address of the contract instance
    this.instance = this.Contract.address
        ? contract_interface.at(this.Contract.address)
        : { getPizzasByOwner: () => {} };

    if (this.hasContractDeployed()) {
        this.updateDisplayContent();
    }
};

// Generates random DNA from string
Pizza.prototype.getRandomDna = function(name, address, cb) {
    this.instance.generateRandomDna(name, address, function(error, result) {
        cb(error, result);
    });
};

// Returns all pizzas owned by specific address
Pizza.prototype.getPizzasByOwner = function(address, cb) {
    this.instance.getPizzasByOwner(address, function(error, result) {
        cb(error, result);
    });
};

// Waits for receipt from transaction
Pizza.prototype.waitForReceipt = function(hash, cb) {
    var that = this;

    // Checks for transaction receipt using web3.js library method
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
            // Try again in 2 seconds
            window.setTimeout(function() {
                that.waitForReceipt(hash, cb);
            }, 2000);
        }
    });
};

// Creates random Pizza from string (name)
Pizza.prototype.createRandomPizza = function() {
    var that = this;

    // Gets input values
    var name = $("#create-name").val();

    // Validates name < 20 chars
    if (name.length > 20) {
        showStatus("Please name your Pizza with less than 32 characters");
        return;
    }

    // Validates name > 0 chars
    if (!name) {
        showStatus("Please enter valid name");
        return;
    }

    $("#button-create").attr("disabled", true);

    // Calls the public `createRandomPizza` function from the smart contract
    this.instance.createRandomPizza(
        name,
        {
            from: window.web3.eth.accounts[0],
            gas: 1000000,
            gasPrice: 1000000000,
            gasLimit: 1000000
        },
        function(error, txHash) {
            if (error) {
                console.log(error);
                $("#button-create").attr("disabled", false);
            } else {
                // If success, wait for confirmation of transaction,
                // then clear form values
                showStatus("Creating pizza");
                that.waitForReceipt(txHash, function(receipt) {
                    if (receipt.status == 1) {
                        showStatus("Creation successful");
                        $("#create-name").val("");
                        $("#create-tab .pizza-container .ingredients").html("");
                        $("#button-create").attr("disabled", false);
                        that.loadInventory();
                    } else {
                        showStatus("Something went wrong, please try it again");
                        $("#button-create").attr("disabled", false);
                    }
                });
            }
        }
    );
};

// Loads all Pizzas owned by user
Pizza.prototype.loadInventory = function() {
    var that = this;

    this.instance.getPizzasByOwner(window.web3.eth.accounts[0], function(
        error,
        pizzaIds
    ) {
        if (error) {
            console.log(error);
        } else {
            $(".inventory-list").html("");

            if (pizzaIds.length > 0) {
                for (let i = 0; i < pizzaIds.length; i++) {
                    that.instance.pizzas(pizzaIds[i].toNumber(), function(
                        error,
                        pizza
                    ) {
                        var realIndex = pizzaIds[i].toNumber();
                        var pizzaName = pizza[0];
                        var pizzaId = pizza[1];
                        var pizza = that.generatePizzaImage(pizza[1]);
                        var actionButtons =
                            '<div class="action-buttons">\
                            <button class="btn button-gift" id="' +
                            realIndex +
                            '">Gift</button>\
                            <button class="btn button-eat" id="' +
                            realIndex +
                            '">Eat</button>\
                            </div>';

                        $(".inventory-list").append(
                            '<div id="pizza-' +
                                realIndex +
                                '" class="col-lg-6">\
                            <div class="pizza-container">\
                            <p><span style="float: left;">' +
                                pizzaName +
                                '</span><span id="' +
                                pizzaId +
                                '" class="pizzaDna" style="float: right;">#' +
                                pizzaId +
                                '</span></p>\
                            <div class="pizza-inner-container">\
                            <img class="pizza-frame" src="https://studio.ethereum.org/static/img/cryptopizza/container.jpg"/>\
                            <img src="https://studio.ethereum.org/static/img/cryptopizza/corpus.png"/>\
                            <div class="ingredients">\
                            ' +
                                pizza +
                                "\
                            </div></div>" +
                                actionButtons +
                                "</div></div>"
                        );

                        $(".inventory-list").append("</div>");
                        $(".inventory-list").append("</div>");
                        realIndex++;
                    });
                }
            } else {
                $(".inventory-list").append(
                    '<p style="text-align: center; width: 100%">It seems you don\'t have any CryptoPizza yet</p>'
                );
            }
        }
    });
};

// Updates container of Create new Pizza
Pizza.prototype.updateCreateContainer = function() {
    var pizzaName = $("#create-name").val();
    var that = this;

    // Disallow negative numbers
    if (pizzaName.length > 0) {
        var address = window.web3.eth.accounts[0];

        this.getRandomDna(pizzaName, address, function(error, pizzaDna) {
            if (error) {
                console.log(error);
            } else {
                if (pizzaDna.toNumber() == 5142446803) {
                    var a = new Audio(
                        "https://studio.ethereum.org/static/img/cryptopizza/1.mp3"
                    );
                    a.play();
                }
                var pizzaImage = that.generatePizzaImage(pizzaDna.toNumber());
                $("#pizza-create-container .ingredients").html(pizzaImage);
            }
        });
    } else {
        $("#pizza-create-container .ingredients").html("");
    }
};

// Generates images from DNA - returns all of them in HTML
Pizza.prototype.generatePizzaImage = function(dna) {
    var url = "https://studio.ethereum.org/static/img/cryptopizza/";
    dna = dna.toString();
    var basis = (dna.substring(0, 2) % 2) + 1;
    var cheese = (dna.substring(2, 4) % 10) + 1;
    var meat = (dna.substring(4, 6) % 18) + 1;
    var spice = (dna.substring(6, 8) % 7) + 1;
    var veggie = (dna.substring(8, 10) % 22) + 1;

    var image = "";
    image += '<img src="' + url + "basis/basis-" + basis + '.png"/>';
    image += '<img src="' + url + "cheeses/cheese-" + cheese + '.png"/>';
    image += '<img src="' + url + "meats/meat-" + meat + '.png"/>';
    image += '<img src="' + url + "spices/spice-" + spice + '.png"/>';
    image += '<img src="' + url + "veggies/veg-" + veggie + '.png"/>';

    if (dna == 5142446803) {
        image =
            '<img src="https://studio.ethereum.org/static/img/cryptopizza/basis/basis-2.png"/>\
                 <img src="https://studio.ethereum.org/static/img/cryptopizza/meats/meat-13.png"/>\
                 <img src="https://studio.ethereum.org/static/img/cryptopizza/8fe918632d847e8ea3ebffbd47bd8ca9.png"/>';
    }

    return image;
};

// Gifts Pizza
Pizza.prototype.giftPizza = function(pizzaId, cb) {
    var that = this;

    var sendTo = prompt("Enter address which should receive your Pizza");

    if (!isValidAddress(sendTo)) {
        showStatus("Please enter a valid address");
        return;
    }

    $(".button-gift, .button-eat").attr("disabled", true);
    $("#pizza-" + pizzaId).css("opacity", "0.7");

    var pizzaDna = $("#pizza-" + pizzaId + " .pizzaDna").attr("id");

    if (pizzaDna == 5142446803) {
        var a = new Audio(
            "https://studio.ethereum.org/static/img/cryptopizza/2.mp3"
        );
        a.play();
    }

    // Calls the public `transferFrom` function from the smart contract
    this.instance.transferFrom(
        window.web3.eth.accounts[0],
        sendTo,
        pizzaId,
        {
            from: window.web3.eth.accounts[0],
            gas: 100000,
            gasPrice: 1000000000,
            gasLimit: 100000
        },
        function(error, txHash) {
            if (error) {
                console.error(error);
                showStatus("Sending canceled.");
                $("#pizza-" + pizzaId).css("opacity", "1");
                return;
            } else {
                showStatus("Sending Pizza...");
                that.waitForReceipt(txHash, function(receipt) {
                    if (receipt.status == 1) {
                        // If success, wait for confirmation of transaction,
                        // then clear form values
                        $(".inventory-list").html("");
                        $(".button-gift, .button-eat").attr("disabled", false);
                        showStatus("Pizza sent");
                        that.loadInventory();
                    } else {
                        showStatus("Pizza was not sent. Please try it again.");
                        $(".button-gift, .button-eat").attr("disabled", false);
                        $("#pizza-" + pizzaId).css("opacity", "1");
                    }
                });
            }
        }
    );
};

// Eats Pizza
Pizza.prototype.eatPizza = function(pizzaId, cb) {
    var that = this;

    var confirmation = confirm("Are you sure?");

    if (confirmation) {
        $(".button-gift, .button-eat").attr("disabled", true);
        $("#pizza-" + pizzaId).css("opacity", "0.7");

        var pizzaDna = $("#pizza-" + pizzaId + " .pizzaDna").attr("id");

        if (pizzaDna == 5142446803) {
            var a = new Audio(
                "https://studio.ethereum.org/static/img/cryptopizza/3.mp3"
            );
            a.play();
        }

        // Calls the public `burn` function from the smart contract
        this.instance.burn(
            pizzaId,
            {
                from: window.web3.eth.accounts[0],
                gas: 100000,
                gasPrice: 1000000000,
                gasLimit: 100000
            },
            function(error, txHash) {
                if (error) {
                    console.error(error);
                    $(".button-gift, .button-eat").attr("disabled", false);
                    $("#pizza-" + pizzaId).css("opacity", "1");
                    showStatus("Eating canceled.");
                    return;
                } else {
                    showStatus("Eating Pizza...");
                    that.waitForReceipt(txHash, function(receipt) {
                        if (receipt.status == 1) {
                            $(".inventory-list").html("");
                            $(".button-gift, .button-eat").attr(
                                "disabled",
                                false
                            );
                            showStatus("Pizza is gone");
                            that.loadInventory();
                        } else {
                            showStatus(
                                "Pizza was not eaten. Please try it again."
                            );
                            $(".button-gift, .button-eat").attr(
                                "disabled",
                                false
                            );
                            $("#pizza-" + pizzaId).css("opacity", "1");
                        }
                    });
                }
            }
        );
    } else {
        showStatus("Canceled");
    }
};

// Binds all inputs and buttons to specific functions
Pizza.prototype.bindInputs = function() {
    var that = this;
    var timeout = null; // Set timeout to every input so it doesn't fire too often

    $(document).on("change textInput input", "#create-name", function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            that.updateCreateContainer();
        }, 250);
    });

    $(document).on("click", "#button-create", function() {
        that.createRandomPizza();
    });

    $(document).on("click", "button.button-gift", function() {
        var pizzaId = $(this).attr("id");
        that.giftPizza(pizzaId);
    });

    $(document).on("click", "button.button-eat", function() {
        var pizzaId = $(this).attr("id");
        that.eatPizza(pizzaId);
    });
};

// Removes the welcome content, and displays the main content.
// Called once a contract has been deployed
Pizza.prototype.updateDisplayContent = function() {
    this.hideWelcomeContent();
    this.showMainContent();
};

Pizza.prototype.hideWelcomeContent = function() {
    $("#welcome-container").addClass("hidden");
};

Pizza.prototype.showMainContent = function() {
    $("#main-container").removeClass("hidden");
};

// A contract will not have its address set until it has been deployed
Pizza.prototype.hasContractDeployed = function() {
    return this.instance && this.instance.address;
};

// Shows status on bottom of the page when some action happens
function showStatus(text) {
    var status = document.getElementById("status");
    status.innerHTML = text;
    status.className = "show";
    setTimeout(function() {
        status.className = status.className.replace("show", "");
    }, 3000);
}

// Checks if provided address has the basic requirements of an address
function isValidAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

if (typeof Contracts === "undefined")
    var Contracts = { CryptoPizza: { abi: [] } };
var pizza = new Pizza(Contracts["CryptoPizza"]);

Pizza.prototype.onReady = function() {
    this.init();
    this.bindInputs();
    this.loadInventory();
    showStatus("DApp loaded successfully.");
};

$(document).ready(function() {
    pizza.onReady();
});
