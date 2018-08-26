import classNames from 'classnames';
import styleNormal from './style-normal';
import styleSmall from './style-small';
import classnames from 'classnames';
import Web3 from 'web3';

export default class RenderTransactions {
    constructor(txlog, renderSmall, redrawFn) {
        this.txlog = txlog;
        this.style = (renderSmall) ? styleSmall : styleNormal;
        this.web3 = new Web3();
        this.redraw = redrawFn;  // We use this to trigger a redraw of the parent component.
        this.bottomVisible = {};
    }

    renderTransactions = (network) => {
        const transactions=this.txlog.transactions(network).map(transaction=>{
            return this._renderTransaction(transaction, network);
        });

        return (
            <div class={this.style.inner}>
                {transactions}
            </div>
        );
    };

    renderTransactionsFloat = (network, maxCount, maxAge) => {
        // Max count of txs to render (in rev. order), 0 = all.
        // We can set a max age of tx to show, in seconds.
        const classes = {};  // We pass on some css classes for fade in/out.
        var count = 0;
        const transactions=this.txlog.transactions(network).map(transaction=>{
            if (transaction.state.hidden) return;
            if (count++ >= maxCount) return;  // maxCount = 0 means take all.
            if (maxAge > 0) {
                // Check timestamp
                if (Date.now() - transaction.ts > maxAge*1000) {
                    transaction.state.hidden = true;
                    classes[this.style.fadeout] = true;
                }
            }
            classes[this.style.fadein] = !transaction.state.hasBeenRendered;  // Fade in if first time rendered.
            transaction.state.hasBeenRendered = true;
            return this._renderTransaction(transaction, network, classes);
        });

        return (
            <div class={this.style.inner}>
                {transactions}
            </div>
        );
    };

    _renderTransaction = (tx, network, classes) => {
        if (!tx.obj ) {
            // Waiting for tx to be propagated around network.
            return (
                <div class={style.txbox}>
                    Waiting for tx to propagate
                </div>
            );
        }
        else {
            if (tx.contract) {
                // contract deployment
                return this._renderBox(tx, "deployment", network, classes);
            }
            else {
                // Transaction to account/contract
                return this._renderBox(tx, "transaction", network, classes);
            }
        }
    };

    _renderStatus = (tx) => {
        if (!tx.receipt) {
            return (
                <div class={classNames([this.style.status, this.style.pending])}>
                    Success
                </div>
            );
        }
        else {
            if (parseInt(tx.receipt.status) == 1) {
                return (
                    <div class={classNames([this.style.status, this.style.success])}>
                    </div>
                );
            }
            else {
                return (
                    <div class={classNames([this.style.status, this.style.failure])}>
                    </div>
                );
            }
        }
    };

    _mapAddress = (address, network) => {
        const contracts = this.txlog.contracts(network);
        const accounts = this.txlog.accounts(network);
        if (contracts[address]) {
            return (
                <span title={address} class={this.style.contractAddress}>this.contracts[address]</span>
            );
        }
        else if (accounts[address]) {
            return (
                <span title={address} class={this.style.accountAddress}>this.accounts[address]</span>
            );
        }
        return address;
    };

    _renderAddress = (address, network) => {
        const mappedAddress = this._mapAddress(address, network);
        return (
            <div class={this.style.address}>
                {mappedAddress}
            </div>
        );
    };

    _formatAge = (ts) => {
        var seconds = parseInt((Date.now() - ts)/1000);
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes*60;
        const hours = Math.floor(minutes / 60);
        minutes -= hours*60;
        var ret="";
        if (hours > 0) {
            ret += hours + " h ";
        }
        if (minutes > 0) {
            ret += minutes + " min ";
        }
        else if (hours==0) {
            ret += seconds + " sec";
        }
        return ret;
    };

    _renderAge = (tx) => {
        const age = this._formatAge(tx.ts);
        return(
            <div>
                Age: {age}
            </div>
        );
    };

    _renderOrigin = (tx) => {
        return (
            <div>
                Origin: {tx.origin}
            </div>
        );
    };

    _renderBlockNr = (tx) => {
        var blockNr = "n/a";
        var index="n/a";
        if (tx.receipt) {
            blockNr = tx.receipt.blockNumber;
            index = tx.receipt.transactionIndex;
        }
        return (
            <div>
                Block #{blockNr} <span title="Order of this transaction inside the block">(Index {index})</span>
            </div>
        );
    };

    _renderDeployArguments = (tx) => {
        // The deploy arguments are provided as is and do not have to be decoded.
        // TODO: these args need decoding from names to addresses... possibly.
        const args2 = [];
        tx.deployArgs.map((arg) => {
            if (arg.value !== undefined) args2.push(arg.value);
            else if (arg.account !== undefined) args2.push("Account: " + arg.account);
            else if (arg.contract !== undefined) args2.push("Contract: " + arg.contract);
        });
        return (
            <div>
                Constructor arguments {args2.join(', ')}
            </div>
        );
    };

    _renderHeader = (tx, type) => {
        if (type == 'deployment') {
            return (
                <div class={this.style.header}>
                    <div class={this.style.title}>
                        Deploy {tx.contract}
                    </div>
                    {this._renderStatus(tx)}
                </div>
            );
        }
        else {
            return (
                <div class={this.style.header}>
                    <div class={this.style.title}>
                        Transaction
                    </div>
                    {this._renderStatus(tx)}
                </div>
            );
        }
    };

    _renderLeft = (tx, type, network) => {
        if (type == "deployment") {
            return (
                <div class={this.style.left}>
                    <div class={this.style.row}>
                        Creator: {this._renderAddress(tx.obj.from, network)}
                    </div>
                    <div class={this.style.row}>
                        Contract address: {this._renderAddress((tx.receipt||{}).contractAddress)}
                    </div>
                </div>
            );
        }
        else {
            const value = (typeof(tx.obj.value)=="object"?tx.obj.value.toNumber():tx.obj.value);
            const valueFormatted = this.web3.fromWei(value);
            return (
                <div class={this.style.left}>
                    <div class={this.style.row}>
                        From: {this._renderAddress(tx.obj.from)}
                    </div>
                    <div class={this.style.row}>
                        To: {this._renderAddress(tx.obj.to)}
                    </div>
                    <div class={this.style.row}>
                        Value: <span title="{value} wei">{valueFormatted} ether</span>
                    </div>
                </div>
            );
        }
    };

    _renderTransactionData = (tx) => {
        return (
            <div>&nbsp;</div>
        );
    };

    _renderBottomContentLeft = (tx, type) => {
        if (type == "deployment") {
            return (
                <div class={this.style.left}>
                    <div class={this.style.row}>
                        <div class={this.style.deployArgs}>
                            {this._renderDeployArguments(tx)}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div class={this.style.left}>
                    <div class={this.style.row}>
                        <div class={this.style.deployArgs}>
                            {this._renderTransactionData(tx)}
                        </div>
                    </div>
                </div>
            );
        }
    };

    _renderBox = (tx, type, network, classes) => {
        classes = classes || {};
        const gasUsed = ((tx.receipt||{}).gasUsed||0);
        const gasPrice = (typeof(tx.obj.gasPrice)=="object"?tx.obj.gasPrice.toNumber():tx.obj.gasPrice);
        const gasCost = gasUsed * gasPrice;
        const gasPriceFormatted = this.web3.fromWei(gasPrice, "gwei");
        const gasCostFormatted = this.web3.fromWei(gasCost, "ether");
        classes[this.style.txbox] = true;
        return (
            <div className={classnames(classes)}>
                {this._renderHeader(tx, type)}
                {this._renderLeft(tx, type, network)}
                <div class={this.style.right}>
                    <div class={this.style.row}>
                        {this._renderAge(tx)}
                    </div>
                    <div class={this.style.row}>
                        {this._renderOrigin(tx)}
                    </div>
                    <div class={this.style.row}>
                        {this._renderBlockNr(tx)}
                    </div>
                    <div class={this.style.row}>
                        Gas used: {gasUsed}
                    </div>
                </div>
                <div class={this.style.bottom}>
                    <div class={this.style.bottomButton}>
                        <a href="" onClick={(e)=>{this._toggleBottom(tx);e.preventDefault()}}>Show more</a>
                    </div>
                    {this.bottomVisible[tx.hash] &&
                    <div class={this.style.bottomContent}>
                        {this._renderBottomContentLeft(tx, type)}
                        <div class={this.style.right}>
                            <div class={this.style.row}>
                                Gas Limit: {tx.obj.gas}
                            </div>
                            <div class={this.style.row}>
                                Gas Price: {gasPriceFormatted} GWei
                            </div>
                            <div class={this.style.row}>
                                Gas cost: {gasCostFormatted} Ether
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    };

    _toggleBottom = (tx) => {
        const obj = this.bottomVisible;
        this.bottomVisible[tx.hash] = !this.bottomVisible[tx.hash];
        this.redraw();
    };

    _shorten=(s)=>{
        s=s||"";
        if(s.length>3) {
            return (
                <div>
                    <span title={s}>
                        {s.substr(0,5) + "..."}
                    </span>
                </div>
            );
        }
        else {
            return s;
        }
    };
}
